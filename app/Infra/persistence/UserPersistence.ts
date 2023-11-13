import { AuthWrapper, Pagination, PasswordInsert, PromptEntityWithWrite, ProposalEntityWithWrite, UserEntity, UserRepository, WriteEntity } from "@ioc:forfabledomain"
import User from 'App/Models/User'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import { PasswordSchema } from "App/Utils/secure"
import { AuthContract } from "@ioc:Adonis/Addons/Auth"
import { paginate } from "./utils"
import { softDelete } from "App/Utils/soft-delete"
import Write from "App/Models/Write"
import Proposal from "App/Models/Proposal"
import Prompt from "App/Models/Prompt"

export class UserPersistence implements UserRepository {
  public static instance = new UserPersistence()

  async create(body: PasswordInsert & Pick<UserEntity, 'name' | 'email' | 'birthDate'> & { isAdmin: boolean }): Promise<UserEntity> {
    const { repeatPassword, ...rest } = body
    return User.create(rest)
  }

  async isNeedToVerifyEmail(): Promise<boolean> {
    return Env.get('NEED_TO_VERIFY_EMAIL')
  }

  async find(entityId: number): Promise<UserEntity | null> {
    return await User.find(entityId)
  }

  async findAll(page?: number, limit?: number): Promise<Pagination<UserEntity>['data']> {
    const toIgnoreId = String(Env.get('TO_IGNORE_USER_ID'))

    return paginate(
      await User.query()
        .orderBy('score', 'desc')
        .where('id', '!=', toIgnoreId)
        .paginate(page || 1, limit)
    )
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

  async findByIdentify(identify: string): Promise<UserEntity | null> {
    const userByEmail = await User.findBy('email', identify)
    if (userByEmail) { return userByEmail }
    const userByName = await User.findBy('name', identify)
    if (userByName) { return userByName }
    return null
  }

  async softDelete(userId: number): Promise<UserEntity | null> {
    const user = await User.find(userId)
    if(user){
      softDelete(user)
      return user
    } else {
      return null
    }
  }


  async indexWritesByAuthor(authorId: number, page?: number, limit?: number): Promise<Pagination<PromptEntityWithWrite | ProposalEntityWithWrite>['data']> {
    const query = await Write.query().orderBy('created_at', 'desc').where('author_id', authorId).paginate(page || 1, limit)
    const paginatedQuery = paginate<WriteEntity>(query)
    if(!paginatedQuery) { return paginatedQuery }
    const { all, meta } = paginatedQuery
  
    let proposalQuery = await Proposal.query()
      .whereIn('write_id', all.map(write => write.id))
      .join('writes', 'proposals.write_id', '=', 'writes.id')

    let promptQuery = await Prompt.query()
      .whereIn('write_id', all.map(write => write.id))
      .join('writes', 'prompts.write_id', '=', 'writes.id')

    return {
      all: [
        ...promptQuery,
        ...proposalQuery
      ],
      meta: meta
    }
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


export class AdonisAuthWrapper implements AuthWrapper {
  constructor(private readonly auth: AuthContract) { }

  async validateWithCredential(identify: string, password: string): Promise<{token: string|undefined}> {
    try{
      const userData = await this.auth.use('api').attempt(
        identify, password, { expiresIn: '12 hours' }
      )
      return {token: userData.token}
    } catch (e) {
      return { token: undefined }
    }
  }
}