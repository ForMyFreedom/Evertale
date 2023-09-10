// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Env from '@ioc:Adonis/Core/Env'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import { randomSalt } from 'App/Utils/secure'

export default class MailController {
  public async vapo({ response }: HttpContextContract) {
    await Mail.sendLater((message) => {
      message.htmlView('emails/verify-register', {
        user: { fullName: 'Test' },
        url: 'hets',
      })
    })
    response.ok({ message: 'nice!' })

  public static async sendUserVerificationMail(user: User): Promise<void> {
    const token = await Token.create(createTokenFromUser(user, 'email_verification'))

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
  }
}

function createTokenFromUser(user: User, type: string) {
  return {
    userId: user.id,
    token: Encryption.encrypt(user.id + user.createdAt.toString() + randomSalt()),
    type: type,
  }
}
