import { BaseHTTPService } from './BaseHTTPService'
import { MailSender, ExceptionHandler, TokenRepository } from '../contracts'
import { UserEntity } from '../entities'
import { MailUsecase } from '../usecases'

export class MailService extends BaseHTTPService implements MailUsecase {
  constructor(
    private readonly mailSender: MailSender,
    private readonly tokenRepository: TokenRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async sendUserResetPasswordMail(user: UserEntity): Promise<void> {
    const token = await this.tokenRepository.create(user, 'reset_password')

    this.mailSender.sendUserRequestPasswordMail(user, token)
  }

  public async sendUserVerificationMail(user: UserEntity): Promise<void> {
    const token = await this.tokenRepository.create(user, 'email_verification')

    this.mailSender.sendUserVerificationMail(user, token)
  }
}

