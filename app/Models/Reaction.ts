import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Write from './Write'

export enum ReactionType {
  'POSITIVE' = 'POSITIVE',
  'NEGATIVE' = 'NEGATIVE',
  'CONCLUSIVE' = 'CONCLUSIVE',
  'COMPLAINT' = 'COMPLAINT',
  'POSITIVE_CONCLUSIVE' = 'POSITIVE_CONCLUSIVE',
}

export class CommentReaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public commentId: number

  @column()
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  public comment: BelongsTo<typeof Comment>
}

export class WriteReaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public writeId: number

  @column({ serialize: (value) => ReactionType[value] })
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>
}
