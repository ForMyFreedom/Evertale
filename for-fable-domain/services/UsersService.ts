import { BaseHTTPService } from './BaseHTTPService'
import { ExceptionContract, ExceptionHandler, TokenRepository, UserRepository } from '../contracts'
import { RestartPasswordInsert, UserEntity, UserInsert } from '../entities'
import { MailUsecase, UsersUsecase } from '../usecases'
import { prettifyErrorList } from '../utils'

export class UsersService extends BaseHTTPService implements UsersUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly mailService: MailUsecase,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async index(): Promise<void> {
    this.exceptionHandler.SucessfullyRecovered(
      await this.userRepository.findAll()
    )
  }

  public async show(userId: UserEntity['id']): Promise<void> {
    const user = await this.userRepository.find(userId)
    if (user) {
      this.exceptionHandler.SucessfullyRecovered(user)
    } else {
      this.exceptionHandler.UndefinedId()
    }
  }

  public async storeUser(body: UserInsert, isAdmin: boolean): Promise<void> {

    const user = await this.userRepository.create({ ...body, isAdmin: isAdmin })

    const needToVerifyEmail = await this.userRepository.isNeedToVerifyEmail()
    if (needToVerifyEmail) {
      await this.mailService.sendUserVerificationMail(user)
    }

    await this.userRepository.update(user.id, {emailVerified: !needToVerifyEmail})

    this.exceptionHandler.SucessfullyCreated(user)
  }

  public async storeAdmin(body: UserInsert): Promise<void> {
    return await this.storeUser(body, true)
  }

  public async update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserInsert>): Promise<void> {
    if (!responserId) {
      return this.exceptionHandler.Unauthenticated()
    }
    const { email, ...rest } = partialBody
    const user = await this.userRepository.find(userId)

    if (!user) {
      return this.exceptionHandler.UndefinedId()
    }

    if (responserId === user.id) {
      this.exceptionHandler.SucessfullyUpdated(
        await this.userRepository.update(user.id, rest)
      )
    } else {
      this.exceptionHandler.CantEditOtherUser()
    }
  }

  public async destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<void> {
    if (!responserId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const user = await this.userRepository.find(userId)

    if (!user) {
      return this.exceptionHandler.UndefinedId()
    }

    if (user.id === responserId) {
      await user.softDelete()
      this.exceptionHandler.SucessfullyDestroyed(user)
    } else {
      this.exceptionHandler.CantDeleteOtherUser()
    }
  }

  public async verifyEmail(token: string|undefined): Promise<void> {
    if (!token) {
      return this.exceptionHandler.BadRequest()
    }

    const findToken = await this.tokenRepository.findByToken(token) 

    if (!findToken) {
      return this.exceptionHandler.BadRequest()
    }

    const user = await findToken.getUser()
    user.emailVerified = true
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    return this.exceptionHandler.SuccessfullyAuthenticated()
  }

  public async requestPasswordChange(user: UserEntity|undefined): Promise<void> {
    if (!user) {
      return this.exceptionHandler.Unauthenticated()
    }
    await this.mailService.sendUserResetPasswordMail(user)
    this.exceptionHandler.EmailSended()
  }

  public async restartPassword(langContract: ExceptionContract, token: string|undefined, body: RestartPasswordInsert): Promise<{error?: string}> {
    if (!token) {
      return { error: langContract.UndefinedToken }
    }

    const { errors } = await this.userRepository.passwordIsValid(body)
    if (errors) {
      return { error: prettifyErrorList(errors) }
    }

    const findToken = await this.tokenRepository.findByToken(token)

    if (!findToken) {
      return { error: langContract.TokenIsInvalid }
    }

    const user = await findToken.getUser()
    user.password = body.password
    await this.userRepository.update(user.id, user)
    await this.tokenRepository.delete(findToken.id)

    return {}
  }
}
