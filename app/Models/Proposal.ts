import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Reaction from './Reaction'
import Write from './Write'

export default class Proposal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public authorId: number

  @column()
  public writeId: number

  @column()
  public isDefinitive: boolean

  @column()
  public orderInHistory: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Reaction)
  public reactions: HasMany<typeof Reaction>
}
