import { column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { TokenEntity } from '@ioc:forfabledomain'
import { BaseAdonisModel } from './_Base'

export default class Token extends BaseAdonisModel implements TokenEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public userId: number

  @column()
  public type: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public async getUser(this: Token): Promise<User> {
    await this.load('user')
    return this.user
  }
}
