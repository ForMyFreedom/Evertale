import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { WriteReaction } from './Reaction'
import { BOOLEAN_SERIAL } from './_Base'
import { WriteReactionEntity, WriteEntity, UserEntity } from '@ioc:forfabledomain'

export default class Write extends BaseModel implements WriteEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column(BOOLEAN_SERIAL)
  public edited: boolean

  @column()
  public authorId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @hasMany(() => WriteReaction)
  public reactions: HasMany<typeof WriteReaction>

  public async getAuthor(): Promise<UserEntity> { return this.author }
  public async getReactions(): Promise<WriteReactionEntity[]> { return this.reactions }
}
