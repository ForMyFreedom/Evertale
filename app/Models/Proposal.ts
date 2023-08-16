import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Reaction from './Reaction'

export default class Proposal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public authorId: number

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @column()
  public text: string

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Reaction)
  public reactions: HasMany<typeof Reaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
