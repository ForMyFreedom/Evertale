import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyParserValidator } from './MyValidators'
import { DateTime } from 'luxon'

const UserValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'users', column: 'name' })]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
  isAdmin: schema.boolean(),
  birthDate: schema.date(),
  password: schema.string(),
})

type GenreInputType = {
  name: string
  email: string
  isAdmin: boolean
  birthDate: DateTime
  password: string
}

export default class UserValidator extends MyParserValidator<
  typeof UserValidatorSchema,
  GenreInputType
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return UserValidatorSchema
  }

  public TrueCast(validatedBody: (typeof UserValidatorSchema)['props']): GenreInputType {
    return {
      ...validatedBody,
      isAdmin: Boolean(validatedBody.isAdmin),
    }
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
