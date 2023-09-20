import Encryption from '@ioc:Adonis/Core/Encryption'
import { TokenEntity, TokenRepository, UserEntity } from "@ioc:forfabledomain"
import Token from "App/Models/Token"
import { randomSalt } from 'App/Utils/secure'

export class TokenPersistence implements TokenRepository {
  public static instance = new TokenPersistence()

  async create(user: UserEntity, type: string): Promise<TokenEntity> {
    return Token.create({
      userId: user.id,
      type: type,
      token: Encryption.encrypt(
        user.id + user.createdAt.toString() + randomSalt()
      ),
    })
  }

  async findByToken(token: string): Promise<TokenEntity | null> {
    return await Token.query().preload('user').where('token', token).first()
  }

  async delete(tokenId: number): Promise<TokenEntity | null> {
    const token = await Token.find(tokenId)
    if (token) {
      await token.delete()
      return token
    } else {
      return null
    }
  }
}