import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema } from 'App/Utils/secure'

export const UserValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  image: schema.string({}, [rules.url()]),
  isAdmin: schema.boolean(),
  birthDate: schema.date(),
  ...PasswordSchema,
})

export class UserValidator extends MyValidator<typeof UserValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return UserValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
