// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Prompt from 'App/Models/Prompt'
import PromptValidator from 'App/Validators/PromptValidator'

export default class PromptsController {
  public async index({ response }: HttpContextContract): Promise<void> {
    const prompts = await Prompt.all()
    ExceptionHandler.SucessfullyRecovered(response, prompts)
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    try {
      const prompt = await Prompt.findOrFail(params.id)
      await prompt.load('author')
      delete prompt.$attributes.authorId
      ExceptionHandler.SucessfullyRecovered(response, prompt)
    } catch (e) {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const body = await new PromptValidator(ctx).validate()
    const authorId = auth?.user?.id
    if (authorId) {
      const prompt = await Prompt.create({ ...body, popularity: 0, authorId: authorId })
      prompt.save()
      ExceptionHandler.SucessfullyCreated(response, prompt)
    } else {
      ExceptionHandler.InvalidUser(response)
    }
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response, params, auth } = ctx
    const prompt = await Prompt.find(params.id)
    const body = await new PromptValidator(ctx).validateAsOptional()
    if (prompt) {
      if (prompt.authorId === auth?.user?.id) {
        ExceptionHandler.SucessfullyUpdated(
          response,
          await Prompt.updateOrCreate({ id: prompt.id }, body)
        )
      } else {
        ExceptionHandler.CantDeleteOthersPrompt(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const prompt = await Prompt.find(params.id)
    if (prompt) {
      if (prompt.authorId === auth?.user?.id) {
        await prompt.delete()
        ExceptionHandler.SucessfullyDestroyed(response, prompt)
      } else {
        ExceptionHandler.CantDeleteOthersPrompt(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}
