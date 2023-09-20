import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export type UsesUsecase<T> = {[key in keyof T]: (ctx: HttpContextContract) => Promise<any>}