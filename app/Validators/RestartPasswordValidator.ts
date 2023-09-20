import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { PasswordSchema, SchemaTyper } from 'App/Utils/secure'
import { AdonisExceptionHandler } from 'App/Exceptions/Handler'
import { PasswordInsert } from '@ioc:forfabledomain'

const langContract = AdonisExceptionHandler.contract
const RestartPasswordSchema: SchemaTyper<PasswordInsert> = schema.create(PasswordSchema)

export default class RestartPasswordValidator extends MyValidator<typeof RestartPasswordSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof RestartPasswordSchema {
    return RestartPasswordSchema
  }

  protected GetMessages(): CustomMessages {
    return {
      required: langContract.PasswordRequired,
      confirmed: langContract.PasswordsDontMatch,
      regex: langContract.PasswordRegex
    }
  }
}
