import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema } from 'App/Utils/secure'

const RestartPasswordSchema = schema.create(PasswordSchema)

export default class RestartPasswordValidator extends MyValidator<typeof RestartPasswordSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return RestartPasswordSchema
  }

  protected GetMessages(): CustomMessages {
    return {
      required: 'Please, insert your password',
      confirmed: 'Password do not match',
      regex:
        'Please, insert a password of at least eight characters with digits, minuscule letter, maiscule letter, and special characters',
    }
  }
}
