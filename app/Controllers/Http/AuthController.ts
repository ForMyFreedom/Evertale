import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async loguin(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const { name, email, password } = await new AuthValidator(ctx).validate()
    if (!name && !email) {
      ExceptionHandler.Unauthenticated(response)
    }
    const uid = name ? name : email
    try {
      await auth.verifyCredentials(uid ?? '', password)
      ExceptionHandler.SuccessfullyAuthenticated(response)
    } catch (e) {
      ExceptionHandler.Unauthorized(response)
    }
  }
}
