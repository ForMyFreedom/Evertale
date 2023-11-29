import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthMiddleware from './Auth'

export default class NoAuth { // This is only to set the User in auth, not to check if the user is logged in
  public async handle({ auth, response }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]) {
    const guards = customGuards.length ? customGuards : [auth.name]
    await AuthMiddleware.authenticate(auth, response, guards)
    await next()
  }
}
