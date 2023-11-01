// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsesUsecase } from './_Conversor'
import LoginProvider from '@ioc:Providers/LoginService'
import { LoginWithCredentialValidator } from 'App/Validators/LoginValidator'
import { LoginController } from '@ioc:forfabledomain'


export default class LoginAdonisController implements UsesUsecase<LoginController> {
    public async loginByCredential(ctx: HttpContextContract): Promise<void> {
        const { identify, password } = await new LoginWithCredentialValidator(ctx).validate()
        await LoginProvider(ctx).loginByCredential(identify, password)
    }
}
