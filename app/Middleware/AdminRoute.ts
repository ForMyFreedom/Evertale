import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminRoute {
  public async handle({ bouncer }: HttpContextContract, next: () => Promise<void>) {
    await bouncer.authorize('admin')
    await next()
  }
}
