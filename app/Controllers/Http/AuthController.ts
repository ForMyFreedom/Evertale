import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async loguin({}: HttpContextContract): Promise<void> {
    console.log()
  }
}
