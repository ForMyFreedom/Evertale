import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyBasicValidator } from './MyValidators'

const UserValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  birthDate: schema.date(),
  password: schema.string(),
})

export default class UserValidator extends MyBasicValidator<typeof UserValidatorSchema> {
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
