import {
  BaseModel,
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
import { calculatePointsThrowReactions } from 'App/Utils/reactions'

export default class Proposal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public writeId: number

  @column()
  public promptId: number

  @column()
  public orderInHistory: number

  @computed()
  public popularity: number

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
    proposal.popularity = calculatePointsThrowReactions(proposal.write.reactions)
  }

  @afterFetch()
  public static async calculateGenreArrayPopularity(proposalArray: Proposal[]) {
    for (const proposal of proposalArray) {
      await Proposal.calculateProposalPopularity(proposal)
    }
  }
}
