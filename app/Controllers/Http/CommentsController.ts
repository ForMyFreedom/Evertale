import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CommentValidator } from 'App/Validators/CommentValidator'
import CommentProvider from '@ioc:Providers/CommentsService'
import { UsesUsecase } from './_Conversor'
import { CommentsUsecase } from '@ioc:forfabledomain'

export default class CommentsController implements UsesUsecase<CommentsUsecase> {
  public async indexByWrite(ctx: HttpContextContract): Promise<void> {
    await CommentProvider(ctx).indexByWrite(ctx.params.id)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const body = await new CommentValidator(ctx).validate()
    const user = ctx.auth?.user
    await CommentProvider(ctx).store(user, body)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const body = await new CommentValidator(ctx).validateAsOptional()
    const userId = auth?.user?.id
    await CommentProvider(ctx).update(userId, params.id, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    await CommentProvider(ctx).destroy(userId, params.id)
  }
}
