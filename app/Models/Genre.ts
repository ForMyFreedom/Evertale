import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import ThematicWord from './ThematicWord'
import Prompt from './Prompt'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public popularity: number

  @column()
  public image: string

  @manyToMany(() => Prompt)
  public prompts: ManyToMany<typeof Prompt>

  @hasMany(() => ThematicWord)
  public thematicWords: HasMany<typeof ThematicWord>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
