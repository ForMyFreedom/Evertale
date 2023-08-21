import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Write extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public popularity: number

  @column({ serialize: (value) => Boolean(value) })
  public edited: boolean

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @column()
  public authorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
