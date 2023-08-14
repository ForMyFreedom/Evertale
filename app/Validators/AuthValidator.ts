import { schema, CustomMessages, TypedSchema, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

const AuthValidatorSchema: ParsedTypedSchema<TypedSchema> = schema.create({
  name: schema.string.optional({}, []),
  email: schema.string.optional({}, []),
  password: schema.string({}, []),
})

export default class AuthValidator extends MyValidator<typeof AuthValidatorSchema> {
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
