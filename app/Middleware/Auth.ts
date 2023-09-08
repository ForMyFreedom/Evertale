import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class AuthMiddleware {
  protected async authenticate(
    auth: HttpContextContract['auth'],
    response: HttpContextContract['response'],
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

    ExceptionHandler.Unauthenticated(response)
    return false
  }

  public async handle(
    { auth, response, bouncer }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]
  ) {
    const guards = customGuards.length ? customGuards : [auth.name]
    const sucess = await this.authenticate(auth, response, guards)
    
    await bouncer.authorize('nonDeleted')
    if (sucess) {
      await next()
    }
  }
}
