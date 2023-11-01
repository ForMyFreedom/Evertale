import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { LoginWithCredentialInsert, LoginWithTokenInsert } from '@ioc:forfabledomain'

export const LoginWithCredentialValidatorSchema: SchemaTyper<LoginWithCredentialInsert> = schema.create({
  identify: schema.string(),
  password: schema.string(),
})

export const LoginWithTokenValidatorSchema: SchemaTyper<LoginWithTokenInsert> = schema.create({
  token: schema.string(),
})

export class LoginWithCredentialValidator extends MyValidator<typeof LoginWithCredentialValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof LoginWithCredentialValidatorSchema {
    return LoginWithCredentialValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}


export class LoginWithTokenValidator extends MyValidator<typeof LoginWithTokenValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof LoginWithTokenValidatorSchema {
    return LoginWithTokenValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}