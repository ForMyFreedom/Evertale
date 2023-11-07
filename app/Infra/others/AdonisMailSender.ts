import Mail from "@ioc:Adonis/Addons/Mail";
import Env from '@ioc:Adonis/Core/Env'
import { EmailSended, MailSender, TokenEntity, UserEntity } from "@ioc:forfabledomain";

export class AdonisMailSender implements MailSender {
  public static instance = new AdonisMailSender()
  
  async sendUserRequestPasswordMail(user: UserEntity, token: TokenEntity): Promise<EmailSended> {
    await Mail.sendLater((message) => {
        message
          .from(Env.get('SMTP_USERNAME'))
          .to(user.email)
          .subject('Password change')
          .htmlView('emails/restart-password', {
            url: `${Env.get('VIEW_URL')}/restart-password/${token.token}`,
          })
    })
    return { sended: true }
  }

  async sendUserVerificationMail(user: UserEntity, token: TokenEntity): Promise<EmailSended> {
    await Mail.sendLater((message) => {
        message
          .from(Env.get('SMTP_USERNAME'))
          .to(user.email)
          .subject('Email verification')
          .htmlView('emails/verify-email', {
            username: user.name,
            url: `${Env.get('API_URL')}/verify-email/${token.token}`,
          })
    })
    return { sended: true }
  }
}
