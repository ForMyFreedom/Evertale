import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { TokenEntity } from '@ioc:forfabledomain'

export default class Token extends BaseModel implements TokenEntity {
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

  public async getUser(): Promise<User> { return this.user }
}
