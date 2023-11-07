import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ReactCommentsProvider from '@ioc:Providers/ReactCommentsService'
import { CommentReactionValidator } from 'App/Validators/CommentReactionValidator'
import { UsesUsecase } from './_Conversor'
import { ReactCommentsController } from '@ioc:forfabledomain'

export default class ReactCommentsAdonisController implements UsesUsecase<ReactCommentsController> {
  public async show(ctx: HttpContextContract): Promise<void> {
    await ReactCommentsProvider(ctx).show(ctx.params.id)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { auth } = ctx
    const body = await new CommentReactionValidator(ctx).validate()
    const userId = auth?.user?.id
    await ReactCommentsProvider(ctx).store(userId, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    await ReactCommentsProvider(ctx).destroy(userId, params.id)
  }
}
