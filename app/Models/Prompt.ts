import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Genre from './Genre'

export default class Prompt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public text: string

  @manyToMany(() => Genre)
  public genres: ManyToMany<typeof Genre>

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @column()
  public authorId: number

  @column()
  public isDaily: boolean

  @column()
  public maxSizePerExtension: number

  @column()
  public limitOfExtensions: number

  @column()
  public popularity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
