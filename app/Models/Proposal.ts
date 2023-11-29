import {
  BelongsTo,
  HasMany,
  ModelQueryBuilderContract,
  afterFetch,
  afterFind,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment'
import Write from './Write'
import Prompt from './Prompt'
import { BOOLEAN_SERIAL, BaseAdonisModel } from './_Base'
import { ReactionEntity, ProposalEntity } from '@ioc:forfabledomain'

export default class Proposal extends BaseAdonisModel implements ProposalEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public writeId: number

  @column()
  public promptId: number

  @column()
  public orderInHistory: number

  @column()
  public currentHistoryText: string

  @column(BOOLEAN_SERIAL)
  public definitive: boolean

  @computed()
  public popularity: number // Good Reactions - Bad Reactions

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @belongsTo(() => Prompt)
  public prompt: BelongsTo<typeof Prompt>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @beforeFind()
  @beforeFetch()
  public static loadWrite(query: ModelQueryBuilderContract<typeof Prompt>) {
    query.preload('write')
  }

  @afterFind()
  public static async calculateProposalPopularity(proposal: Proposal) {
    await proposal.write.load('reactions')
    proposal.popularity = ReactionEntity.calculatePointsThrowReactions(proposal.write.reactions)
  }

  @afterFetch()
  public static async calculateGenreArrayPopularity(proposalArray: Proposal[]) {
    for (const proposal of proposalArray) {
      await Proposal.calculateProposalPopularity(proposal)
    }
  }
}
