import { DateTime } from 'luxon'
import { BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { WriteReaction } from './Reaction'
import { BOOLEAN_SERIAL, BaseAdonisModel } from './_Base'
import { WriteReactionEntity, WriteEntity } from '@ioc:forfabledomain'

export default class Write extends BaseAdonisModel implements WriteEntity {
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

  public async getAuthor(this: Write): Promise<User> {
    await this.load('author')
    return this.author
  }
  public async getReactions(this: Write): Promise<WriteReactionEntity[]> {
    await this.load('reactions')
    return this.reactions
  }
}
