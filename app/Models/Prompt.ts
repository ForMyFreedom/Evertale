import {
  BaseModel,
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
import { DateTime } from 'luxon'
import { calculatePointsThrowReactions } from 'App/Utils/reactions'

export default class Prompt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column({ serialize: (value) => Boolean(value) })
  public isDaily: boolean

  @column()
  public currentIndex: number

  @column({ serialize: (value) => Boolean(value) })
  public concluded: boolean

  @column()
  public writeId: number

  @computed()
  public popularity: number

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @manyToMany(() => Genre)
  public genres: ManyToMany<typeof Genre>

  @hasMany(() => Proposal)
  public proposals: HasMany<typeof Proposal>

  @column()
  public maxSizePerExtension: number

  @column()
  public limitOfExtensions: number

  @beforeFind()
  @beforeFetch()
  public static loadWrite(query: ModelQueryBuilderContract<typeof Prompt>) {
    query.preload('write')
  }

  @afterFind()
  public static async calculatePromptPopularity(prompt: Prompt) {
    await prompt.loadCount('proposals')
    await prompt.write.load('reactions')

    const points = calculatePointsThrowReactions(prompt.write.reactions)
    const amountOfProposals = prompt.$extras.proposals_count
    const startDate = prompt.write.createdAt
    const actualDate = DateTime.now()
    const daysOfExistence = startDate.diff(actualDate).days
    prompt.popularity = points + amountOfProposals / (daysOfExistence + 1)
  }

  @afterFetch()
  public static async calculatePromptArrayPopularity(promptArray: Prompt[]) {
    for (const prompt of promptArray) {
      await Prompt.calculatePromptPopularity(prompt)
    }
  }
}
