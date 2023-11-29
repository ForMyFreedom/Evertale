import type { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdonisResponseHandler from 'App/Exceptions/Handler'

export default class AuthMiddleware {
  public static async authenticate(
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

    response.unauthorized({ error: AdonisResponseHandler.contract.Unauthenticated })
    return false
  }

  public async handle(
    { auth, response, bouncer }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]
  ) {
    const guards = customGuards.length ? customGuards : [auth.name]
    const sucess = await AuthMiddleware.authenticate(auth, response, guards)
    if (sucess) {
      await bouncer.authorize('userIsOk')
      await next()
    }
  }
}
