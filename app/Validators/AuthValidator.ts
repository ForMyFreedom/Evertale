import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyBasicValidator } from './MyValidators'

const AuthValidatorSchema = schema.create({
  name: schema.string.optional({}, []),
  email: schema.string.optional({}, []),
  password: schema.string({}, []),
})

export default class AuthValidator extends MyBasicValidator<typeof AuthValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return AuthValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
