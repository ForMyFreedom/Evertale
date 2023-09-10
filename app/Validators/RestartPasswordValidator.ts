import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema } from 'App/Utils/secure'
import ExceptionHandler from 'App/Exceptions/Handler'

const langContract = ExceptionHandler.contract
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
      required: langContract.PasswordRequired,
      confirmed: langContract.PasswordDontMatch,
      regex: langContract.PasswordRegex
    }
  }
}
