// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MailController {
  public async vapo({ response }: HttpContextContract) {
    await Mail.sendLater((message) => {
      message.htmlView('emails/verify-register', {
        user: { fullName: 'Test' },
        url: 'hets',
      })
    })
    response.ok({ message: 'nice!' })
  }
}
