import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema, SchemaTyper } from 'App/Utils/secure'
import { UserInsert } from '@ioc:forfabledomain'


export const UserValidatorSchema: SchemaTyper<UserInsert> = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  image: schema.string({}, [rules.url()]),
  birthDate: schema.date(),
  ...PasswordSchema,
})

export class UserValidator extends MyValidator<typeof UserValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof UserValidatorSchema {
    return UserValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
