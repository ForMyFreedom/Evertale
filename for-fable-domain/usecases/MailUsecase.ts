import { UserEntity } from '../entities'

export interface MailUsecase {
  sendUserResetPasswordMail(user: UserEntity): Promise<void>
  sendUserVerificationMail(user: UserEntity): Promise<void>
}

