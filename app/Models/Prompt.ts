import {
  BelongsTo,
  HasMany,
  ManyToMany,
  ModelQueryBuilderContract,
  afterFetch,
  afterFind,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Genre from './Genre'
import Write from './Write'
import Proposal from './Proposal'
import { removeDuplicate } from '@ioc:forfabledomain'
import { BOOLEAN_SERIAL, BaseAdonisModel } from './_Base'
import { PromptEntity } from '@ioc:forfabledomain'

export default class Prompt extends BaseAdonisModel implements PromptEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column(BOOLEAN_SERIAL)
  public isDaily: boolean

  @column()
  public currentIndex: number

  @column(BOOLEAN_SERIAL)
  public concluded: boolean

  @column()
  public writeId: number

  @column()
  public maxSizePerExtension: number

  @column()
  public limitOfExtensions: number

  @column()
  public timeForAvanceInMinutes: number

  @computed()
  public popularity: number // The amount of Users that had interacted with

  @computed()
  public historyText: string

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @manyToMany(() => Genre)
  public genres: ManyToMany<typeof Genre>

  @hasMany(() => Proposal)
  public proposals: HasMany<typeof Proposal>

  @beforeFind()
  @beforeFetch()
  public static loadWrite(query: ModelQueryBuilderContract<typeof Prompt>) {
    query.preload('write')
  }

  @afterFind()
  public static async calculatePromptPopularity(prompt: Prompt) {
    PromptEntity.calculatePromptPopularity(
      prompt, await getDistinctParticipantsCount(prompt)
    )
  }

  @afterFetch()
  public static async calculatePromptArrayPopularity(promptArray: Prompt[]) {
    for (const prompt of promptArray) {
      await Prompt.calculatePromptPopularity(prompt)
    }
  }

  @afterFetch()
  public static async setAllHistoryText(promptArray: Prompt[]) {
    for (const prompt of promptArray) {
      await Prompt.setHistoryText(prompt)
    }
  }

  @afterFind()
  public static async setHistoryText(prompt: Prompt) {
    await prompt.load('proposals')
    const definitiveProposalsWrite: Write[] = await Promise.all(prompt.proposals
      .filter((proposal) => proposal.definitive)
      .sort((a, b) => b.orderInHistory - a.orderInHistory)
      .map(async(proposal) => {await proposal.load('write'); return proposal.write})
    )

    await prompt.load('write')
    PromptEntity.setHistoryText(prompt, prompt.write, definitiveProposalsWrite)
    delete prompt.$preloaded.proposals
  }
}

async function getDistinctParticipantsCount(prompt: Prompt): Promise<{id: number}[]> {
  const arrayOfUsersIds: {id: number}[] = []
  arrayOfUsersIds.push(...(await getUsersIdsThatReact(prompt)))
  arrayOfUsersIds.push(...(await getUsersIdsThatComment(prompt)))
  arrayOfUsersIds.push(...(await getUsersIdsThatPropose(prompt)))
  return removeDuplicate(arrayOfUsersIds)
}

async function getUsersIdsThatReact(prompt: Prompt): Promise<{id: number}[]> {
  const reactUsers = await Write.query()
    .join('write_reactions', 'writes.id', '=', 'write_reactions.write_id')
    .where('writes.id', '=', prompt.write.id)
    .select('write_reactions.user_id')

  if (reactUsers.length > 0) {
    return reactUsers.map((data) => {
      return { id: data.$extras.user_id as number }
    })
  } else {
    return []
  }
}

async function getUsersIdsThatComment(prompt: Prompt): Promise<{id: number}[]> {
  const commentsUsers = await Write.query()
    .join('comments', 'writes.id', '=', 'comments.write_id')
    .where('writes.id', '=', prompt.write.id)
    .select('comments.author_id')

  if (commentsUsers.length > 0) {
    return commentsUsers.map((data) => {
      return { id: data.$original.authorId as number }
    })
  } else {
    return []
  }
}

async function getUsersIdsThatPropose(prompt: Prompt): Promise<{id: number}[]> {
  const proposalUsers = await Write.query()
    .join('proposals', 'writes.id', '=', 'proposals.prompt_id')
    .join('writes as prop_writes', 'proposals.write_id', '=', 'prop_writes.id')
    .where('writes.id', '=', prompt.write.id)
    .select('prop_writes.author_id')

  if (proposalUsers.length > 0) {
    return proposalUsers.map((data) => {
      return { id: data.$original.authorId as number }
    })
  } else {
    return []
  }
}
