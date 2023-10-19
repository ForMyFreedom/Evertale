import { PasswordInsert, UserEntity, UserRepository } from "@ioc:forfabledomain"
import User from 'App/Models/User'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import { PasswordSchema } from "App/Utils/secure"

export class UserPersistence implements UserRepository {
  public static instance = new UserPersistence()

  async create(body: PasswordInsert & Pick<UserEntity, 'name' | 'email' | 'image' | 'birthDate'> & { isAdmin: boolean }): Promise<UserEntity> {
    const { repeatPassword, ...rest } = body
    return User.create(rest)
  }

  async isNeedToVerifyEmail(): Promise<boolean> {
    return Env.get('NEED_TO_VERIFY_EMAIL')
  }

  async find(entityId: number): Promise<UserEntity | null> {
    return User.find(entityId)
  }

  async findAll(): Promise<UserEntity[]> {
    return User.all()
  }

  async delete(entityId: number): Promise<UserEntity | null> {
    const user = await User.find(entityId)
    if (user) {
        user.delete()
        return user
    } else {
        return null
    }
  }

  async update(entityId: number, partialBody: Partial<UserEntity>): Promise<UserEntity | null> {
    const user = await User.find(entityId)
    if (user) {
        user.merge(partialBody)
        await user.save()
        return user
    } else {
        return null
    }
  }

  async passwordIsValid(body: PasswordInsert): Promise<{errors?: string[]}> {
    try{
      await validator.validate({
        schema: schema.create(PasswordSchema), data: body
      })
      return {}
    } catch (e) {
      return {errors: getMessageFromError(e)}
    }
  }

  async validateWithCredential(email: string, password: string): Promise<string> {
    throw new Error("Method not implemented.")
  }

  async validateWithToken(token: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
}

function getMessageFromError(e: { messages: any }): string[] {
  const passwordMessages: string[] = e.messages.password
  const repeatPasswordMessages: string[] = e.messages.repeatPassword
  let messages: string[] = []
  if(passwordMessages){
    messages.push(...passwordMessages)
  }
  if(repeatPasswordMessages){
    messages.push(...repeatPasswordMessages)
  }

  return messages
}