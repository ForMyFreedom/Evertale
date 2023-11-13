import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  beforeFind,
  beforeFetch,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { softDeleteQuery } from 'App/Utils/soft-delete'
import Token from './Token'
import { BOOLEAN_SERIAL, BaseAdonisModel } from './_Base'
import { UserEntity } from '@ioc:forfabledomain'

export default class User extends BaseAdonisModel implements UserEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public nickname: string

  @column()
  public imageUrl: string | null

  @column()
  public primaryColorHex: string

  @column()
  public secondaryColorHex: string

  @column({
    consume: (value) => {
      return Boolean(value)
    },
  })
  public isAdmin: boolean

  @column(BOOLEAN_SERIAL)
  public isPremium: boolean

  @column()
  public email: string

  @column({ consume: (value) => Boolean(value) })
  public emailVerified: boolean

  @column()
  public score: number

  @column.dateTime()
  public birthDate: DateTime

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
