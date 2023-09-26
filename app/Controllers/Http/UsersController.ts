import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import { UserValidator } from 'App/Validators/UserValidator'
import { SessionContract } from '@ioc:Adonis/Addons/Session'
import { PasswordInsert, UsersUsecase } from '@ioc:forfabledomain'
import UsersProvider from '@ioc:Providers/UsersService'
import AdonisExceptionHandler from 'App/Exceptions/Handler'
import { UsesUsecase } from './_Conversor'


const langContract = AdonisExceptionHandler.contract

export default class UsersController implements UsesUsecase<UsersUsecase> {
  public async index(ctx: HttpContextContract): Promise<void> {
    return UsersProvider(ctx).index()
  }

  public async show(ctx: HttpContextContract): Promise<void> {
    return UsersProvider(ctx).show(ctx.params.id)
  }

  public async storeUser(ctx: HttpContextContract, isAdmin: boolean = false): Promise<void> {
    const body = await new UserValidator(ctx).validate()
    return UsersProvider(ctx).storeUser(body, isAdmin)
  }

  public async storeAdmin(ctx: HttpContextContract): Promise<void> {
    return await this.storeUser(ctx, true)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { params, auth } = ctx
    const responserId = auth?.user?.id
    const body = await new UserValidator(ctx).validateAsOptional()
    return UsersProvider(ctx).update(responserId, params.id, body)
  }

  public async destroy(ctx: HttpContextContract): Promise<void> {
    const responserId = ctx.auth?.user?.id
    return UsersProvider(ctx).destroy(responserId, ctx.params.id)
  }

  public async verifyEmail(ctx: HttpContextContract): Promise<void> {
    await UsersProvider(ctx).verifyEmail(ctx.request.param('token'))
  }

  public async requestPasswordChange(ctx: HttpContextContract): Promise<void> {
    await UsersProvider(ctx).requestPasswordChange(ctx.auth.user)
  }

  public async restartPasswordView({ request, view }: HttpContextContract): Promise<string> {
    const token = request.param('token')
    return await view.render('password-reset', { token: token })
  }

  public async restartPassword(ctx: HttpContextContract): Promise<void | string> {
    const { request, response, session, view } = ctx
    const token = request.param('token')
    
    const { error } = await UsersProvider(ctx).restartPassword(
      langContract, token, request.body() as PasswordInsert
    )
    if (error) {
      return redirectToPasswordChange(session, response, token, error)
    } else {
      return await view.render('password-reset-sucess')
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
