import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class UsersController {
  public async index({ response }: HttpContextContract): Promise<void> {
    const users = await User.all()
    ExceptionHandler.SucessfullyRecovered(response, users)
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    try {
      const user = await User.findOrFail(params.id)
      ExceptionHandler.SucessfullyRecovered(response, user)
    } catch (e) {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response, request, params } = ctx
    const user = await User.find(params.id)
    await new UserValidator(ctx).validateAsOptional()
    if (user) {
      const { name } = request.only(['name'])
      user.merge({ name: name })
      user.save()
      ExceptionHandler.SucessfullyUpdated(response, user)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async destroy({ response, params }: HttpContextContract): Promise<void> {
    const user = await User.find(params.id)
    if (user) {
      await user.delete()
      ExceptionHandler.SucessfullyDestroyed(response, user)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}
