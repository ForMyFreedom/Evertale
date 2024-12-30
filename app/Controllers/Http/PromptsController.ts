// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PromptValidator } from 'App/Validators/PromptValidator'
import PromptsProvider from '@ioc:Providers/PromptsService'
import { UsesUsecase } from './_Conversor'
import { PromptsController } from '@ioc:forfabledomain'
import DailyPromptValidator from 'App/Validators/DailyPromptValidator'


export default class PromptsAdonisController implements UsesUsecase<PromptsController> {
  public async index(ctx: HttpContextContract): Promise<void> {
    await PromptsProvider(ctx).index()
  }

  public async show(ctx: HttpContextContract): Promise<void> {
    await PromptsProvider(ctx).show(ctx.params.id)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { auth } = ctx
    const body = await new PromptValidator(ctx).validate()
    const userId = auth?.user?.id
    await PromptsProvider(ctx).store(userId, body)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const body = await new PromptValidator(ctx).validateAsOptional()
    const userId = auth?.user?.id
    await PromptsProvider(ctx).update(userId, params.id, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    await PromptsProvider(ctx).destroy(userId, params.id)
  }

  public async appropriateDailyPrompt(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const userId = auth?.user?.id
    const body = await new DailyPromptValidator(ctx).validate()
    await PromptsProvider(ctx).appropriateDailyPrompt(
      userId, params.id, body
    )
  }

  public async indexByAuthor(ctx: HttpContextContract): Promise<void> {
    const { params } = ctx
    const { page, limit } = ctx.request.qs()
    await PromptsProvider(ctx).indexByAuthor(
      params.id, page, limit
    )
  }

  public async getAuthor(ctx: HttpContextContract): Promise<void> {
    await PromptsProvider(ctx).getAuthor(ctx.params.id)
  }

  public async trailDefinitives(ctx: HttpContextContract): Promise<void> {
    await PromptsProvider(ctx).trailDefinitives(ctx.params.id)
  }
}
