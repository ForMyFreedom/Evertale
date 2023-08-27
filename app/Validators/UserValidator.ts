import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const UserValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  image: schema.string({}, [rules.url()]),
  score: schema.number(),
  isAdmin: schema.boolean(),
  birthDate: schema.date(),
  password: schema.string(),
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
