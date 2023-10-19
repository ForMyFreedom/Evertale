// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsesUsecase } from './_Conversor'
import { LoginUsecase } from 'for-fable-domain/usecases/LoginUsecase'
import LoginProvider from '@ioc:Providers/LoginService'
import { LoginWithCredentialValidator, LoginWithTokenValidator } from 'App/Validators/LoginValidator'


export default class LoginController implements UsesUsecase<LoginUsecase> {
    public async loginByCredential(ctx: HttpContextContract): Promise<void> {
        const { auth, response } = ctx
        const { email, password } = await new LoginWithCredentialValidator(ctx).validate()
        const x = await auth.use('api').attempt(
            email, password, {expiresIn: '2 hours'}
        )
        response.accepted(x)
        // await auth.use('api').authenticate()

        //await LoginProvider(ctx).loginByCredential(email, password)
    }

    public async loginByToken(ctx: HttpContextContract): Promise<void> {
        const { token } = await new LoginWithTokenValidator(ctx).validate()
        await LoginProvider(ctx).loginByToken(token)
    }
}
