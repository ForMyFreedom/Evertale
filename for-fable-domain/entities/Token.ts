import { UserEntity } from "./User"

export type TokenInsert = Pick<TokenEntity, 'userId'|'type'>

export abstract class TokenEntity {
  id: number
  token: string
  userId: UserEntity['id']
  type: string

  abstract getUser(): Promise<UserEntity>
}
