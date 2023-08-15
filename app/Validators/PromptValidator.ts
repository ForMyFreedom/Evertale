import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

const PromptValidatorSchema = schema.create({
  title: schema.string(),
  text: schema.string(),
  maxSizePerExtension: schema.number(),
  limitOfExtensions: schema.number(),
})

export default class PromptValidator extends MyValidator<typeof PromptValidatorSchema> {
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
