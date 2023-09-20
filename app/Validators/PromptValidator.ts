import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { PromptInsert } from '@ioc:forfabledomain'

export const PromptValidatorSchema: SchemaTyper<PromptInsert> = schema.create({
  title: schema.string(),
  text: schema.string(),
  maxSizePerExtension: schema.number([rules.unsigned()]),
  limitOfExtensions: schema.number([rules.unsigned()]),
  timeForAvanceInMinutes: schema.number([rules.unsigned()]),
  genreIds: schema.array([rules.minLength(1)]).members(schema.number()),
})

export class PromptValidator extends MyValidator<typeof PromptValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof PromptValidatorSchema {
    return PromptValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
