import { DateTime } from 'luxon'
import { HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { ThematicWordEntity } from '@ioc:forfabledomain'
import Genre from './Genre'
import { BaseAdonisModel } from './_Base'

export default class ThematicWord extends BaseAdonisModel implements ThematicWordEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public genreId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Genre)
  public genre: HasOne<typeof Genre>

  public async getGenre(this: ThematicWord): Promise<Genre> {
    await this.load('genre')
    return this.genre
  }
}
