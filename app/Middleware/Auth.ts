import { ResponseContract } from '@ioc:Adonis/Core/Response'
import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class AuthMiddleware {
  protected redirectTo = '/login'

  protected async authenticate(
    response: ResponseContract,
    auth: HttpContextContract['auth'],
    guards: (keyof GuardsList)[]
  ) {
    let guardLastAttempted: string | undefined

    for (let guard of guards) {
      guardLastAttempted = guard

      if (await auth.use(guard).check()) {
        auth.defaultGuard = guard
        return true
      }
    }

    ExceptionHandler.InvalidAuth(response)
  }

  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]
  ) {
    const guards = customGuards.length ? customGuards : [auth.name]
    await this.authenticate(response, auth, guards)
    await next()
  }
}
