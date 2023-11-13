import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema, SchemaTyper } from 'App/Utils/secure'
import { UserInsert } from '@ioc:forfabledomain'


export const UserValidatorSchema: SchemaTyper<UserInsert> = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  birthDate: schema.date({}, [rules.before(15, 'years')]),
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
    return {
      'unique': '{{ field }} already exists',
      'birthDate.date': 'Birth date is not a valid date',
      'required': 'The field {{ field }} is required',
      'password.regex': 'Password must contain at least: 1 uppercase, 1 lowercase, 1 number and 1 special character',
      'confirmed': 'Passwords must match',
      'email.email': 'Email is not valid',
      'birthDate.before': 'You must be at least 15 years old'
    }
  }
}
