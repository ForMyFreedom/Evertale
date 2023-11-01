import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { GenreValidator } from 'App/Validators/GenreValidator'
import { ThematicWordValidator } from 'App/Validators/ThematicWordValidator'
import GenresProvider from '@ioc:Providers/GenresService'
import { UsesUsecase } from './_Conversor'
import { GenresController } from '@ioc:forfabledomain'


export default class GenresAdonisController implements UsesUsecase<GenresController> {
  public async store(ctx: HttpContextContract): Promise<void> {
    const body = await new GenreValidator(ctx).validate()
    await GenresProvider(ctx).store(body)
  }

  public async index(ctx: HttpContextContract): Promise<void> {
    await GenresProvider(ctx).index()
  }

  public async show(ctx: HttpContextContract): Promise<void> {
    await GenresProvider(ctx).show(ctx.params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { params } = ctx
    const body = await new GenreValidator(ctx).validateAsOptional()
    await GenresProvider(ctx).update(params.id, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    await GenresProvider(ctx).destroy(ctx.params.id)
  }

  public async storeWords(ctx: HttpContextContract): Promise<void> {
    const { params } = ctx
    const words = (await new ThematicWordValidator(ctx).validate()).words
    await GenresProvider(ctx).storeWords(params.id, words)
  }
}
