import { schema, CustomMessages, rules, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const PromptValidatorSchema = schema.create({
  title: schema.string(),
  text: schema.string(),
  concluded: schema.boolean.optional(),
  maxSizePerExtension: schema.number([rules.unsigned()]),
  limitOfExtensions: schema.number([rules.unsigned()]),
  timeForAvanceInMinutes: schema.number([rules.unsigned()]),
  genreIds: schema.array([rules.minLength(1)]).members(schema.number()),
})

export class PromptValidator extends MyValidator<typeof PromptValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return PromptValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
