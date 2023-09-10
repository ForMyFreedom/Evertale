import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import Env from '@ioc:Adonis/Core/Env'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import ExceptionHandler from 'App/Exceptions/Handler'
import MailController from './MailController'
import Token from 'App/Models/Token'
import RestartPasswordValidator from 'App/Validators/RestartPasswordValidator'
import { SessionContract } from '@ioc:Adonis/Addons/Session'
import { prettifyErrorList } from 'App/Utils/views'

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

  public async store(ctx: HttpContextContract): Promise<void> {
    const { response } = ctx
    const { repeatPassword, ...body } = await new UserValidator(ctx).validate()
    const needToVerifyEmail = Env.get('NEED_TO_VERIFY_EMAIL')
    const user = await User.create({ ...body, emailVerified: !needToVerifyEmail })
    await user.save()
    if (needToVerifyEmail) {
      await MailController.sendUserVerificationMail(user)
    }
    ExceptionHandler.SucessfullyCreated(response, user)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response, params, auth } = ctx
    const responserId = auth?.user?.id
    if (!responserId) {
      return ExceptionHandler.InvalidAuth(response)
    }
    const user = await User.find(params.id)
    const { email, ...body } = await new UserValidator(ctx).validateAsOptional()
    if (user) {
      if (responserId === user.id) {
        ExceptionHandler.SucessfullyUpdated(
          response,
          await User.updateOrCreate({ id: user.id }, body)
        )
      } else {
        ExceptionHandler.CantEditOtherUser(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const responserId = auth?.user?.id
    if (!responserId) {
      return ExceptionHandler.InvalidAuth(response)
    }
    const user = await User.find(params.id)
    if (user) {
      if (user.id === responserId) {
        await user.softDelete()
        ExceptionHandler.SucessfullyDestroyed(response, user)
      } else {
        ExceptionHandler.CantEditOtherUser(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async verifyEmail({ response, request }: HttpContextContract): Promise<void> {
    const token = request.param('token')

    if (!token) {
      return ExceptionHandler.BadRequest(response)
    }

    const findToken = await Token.query().preload('user').where('token', token).first()
    if (!findToken) {
      return ExceptionHandler.BadRequest(response)
    }

    findToken.user.emailVerified = true
    await findToken.user.save()
    await findToken.delete()

    return ExceptionHandler.SuccessfullyAuthenticated(response)
  }

  public async requestPasswordChange({ response, auth }: HttpContextContract): Promise<void> {
    const user = auth.user
    if (!user) {
      return ExceptionHandler.InvalidAuth(response)
    }
    await MailController.sendUserResetPasswordMail(user)
    return ExceptionHandler.EmailSended(response)
  }

  public async restartPasswordView({ request, view }: HttpContextContract): Promise<string> {
    const token = request.param('token')
    return await view.render('password-reset', { token: token })
  }

  public async restartPassword(ctx: HttpContextContract): Promise<void | string> {
    const { request, response, session, view } = ctx
    const token = request.param('token')
    if (!token) {
      return redirectToPasswordChange(session, response, token, 'Undefined token')
    }

    try {
      const { password } = await new RestartPasswordValidator(ctx).validate()

      const findToken = await Token.query().preload('user').where('token', token).first()

      if (!findToken) {
        return redirectToPasswordChange(session, response, token, 'Token is invalid')
      }

      findToken.user.password = password
      await findToken.user.save()
      await findToken.delete()

      return await view.render('password-reset-sucess')
    } catch (e) {
      return redirectToPasswordChange(
        session,
        response,
        token,
        prettifyErrorList(e.messages.password)
      )
    }
  }
}

const redirectToPasswordChange = async (
  session: SessionContract,
  response: ResponseContract,
  token: string,
  errorMessage: string
) => {
  session.flash('error', errorMessage)
  response.redirect(`/restart-password/${token}`)
}
