import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import User from 'App/Models/User'
import ImageService from 'App/Services/ImageService'
import UsersController from './UsersController'
import AuthValidator from 'App/Validators/AuthValidator'
import UserValidator from 'App/Validators/UserValidator'

export default class AuthController {
  public async loguin(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const { name, email, password } = await new AuthValidator(ctx).validate()
    if (!name && !email) {
      ExceptionHandler.InvalidAuth(response)
    }
    const uid = name ? name : email
    try {
      await auth.verifyCredentials(uid ?? '', password)
      ExceptionHandler.SuccessfullyAuthenticated(response, { cookie: 'cookie' })
    } catch (e) {
      ExceptionHandler.InvalidAuth(response)
    }
  }

  public async register(ctx: HttpContextContract): Promise<void> {
    const { request, response } = ctx
    const body = await new UserValidator(ctx).validate()
    const user = await User.create(body)
    user.image = await ImageService.uploadImage(request, response, UsersController.FOLDER_NAME)
    user.save()
    ExceptionHandler.SucessfullyCreated(response, user)
  }
}
