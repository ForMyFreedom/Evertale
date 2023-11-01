import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProposalsProvider from '@ioc:Providers/ProposalsService'
import { ProposalValidator } from 'App/Validators/ProposalValidator'
import { UsesUsecase } from './_Conversor'
import { ProposalsController } from '@ioc:forfabledomain'

export default class ProposalsAdonisController implements UsesUsecase<ProposalsController> {
  public async indexByPrompt(ctx: HttpContextContract): Promise<void> {
    await ProposalsProvider(ctx).indexByPrompt(ctx.params.id)
  }

  public async actualIndexByPrompt(ctx: HttpContextContract): Promise<void> {
    await ProposalsProvider(ctx).actualIndexByPrompt(ctx.params.id)
  }

  public async show(ctx: HttpContextContract): Promise<void> {
    await ProposalsProvider(ctx).show(ctx.params.id)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { auth } = ctx
    const body = await new ProposalValidator(ctx).validate()
    const userId = auth?.user?.id
    await ProposalsProvider(ctx).store(userId, body)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    const body = await new ProposalValidator(ctx).validateAsOptional()
    await ProposalsProvider(ctx).update(userId, params.id, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    await ProposalsProvider(ctx).destroy(userId, params.id)
  }
}
