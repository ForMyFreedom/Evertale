import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ReactWritesProvider from '@ioc:Providers/ReactWritesService'
import { WriteReactionValidator } from 'App/Validators/WriteReactionValidator'
import { UsesUsecase } from './_Conversor'
import { ReactWritesUsecase } from '@ioc:forfabledomain'

export default class ReactWritesController implements UsesUsecase<ReactWritesUsecase> {
  public async show(ctx: HttpContextContract): Promise<void> {
    return await ReactWritesProvider(ctx).show(ctx.params.id)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { auth } = ctx
    const userId = auth?.user?.id
    const body = await new WriteReactionValidator(ctx).validate()
    return await ReactWritesProvider(ctx).store(userId, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    return await ReactWritesProvider(ctx).destroy(userId, params.id)
  }
}
