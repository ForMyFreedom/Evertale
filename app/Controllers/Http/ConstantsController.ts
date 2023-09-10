import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from "App/Exceptions/Handler"
import Constant from 'App/Models/Constant'
import { ConstantsValidator } from 'App/Validators/ConstantValidator'

export default class ConstantsController {
  public async show({ response }: HttpContextContract): Promise<void> {
    ExceptionHandler.SucessfullyRecovered(response, await Constant.first())
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response } = ctx
    const body = await new ConstantsValidator(ctx).validateAsOptional()
    const constant = await Constant.first()
    if (!constant) {
      return ExceptionHandler.ServerMisconfigured(response)
    }
    constant.merge(body)
    await constant.save()
    ExceptionHandler.SucessfullyUpdated(response, constant)
  }
}
