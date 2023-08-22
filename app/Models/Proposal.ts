import {
  BaseModel,
  BelongsTo,
  HasMany,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment'
import Reaction from './Reaction'
import Write from './Write'
import Prompt from './Prompt'

export default class Proposal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public writeId: number

  @column()
  public promptId: number

  @column()
  public orderInHistory: number

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @belongsTo(() => Prompt)
  public prompt: BelongsTo<typeof Prompt>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Reaction)
  public reactions: HasMany<typeof Reaction>

  @beforeFind()
  @beforeFetch()
  public static loadWrite(query: ModelQueryBuilderContract<typeof Prompt>) {
    query.preload('write')
  }
}
