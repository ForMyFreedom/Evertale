import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

const DailyPromptValidatorSchema = schema.create({
  text: schema.string(),
  title: schema.string(),
})

export default class DailyPromptValidator extends MyValidator<typeof DailyPromptValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return DailyPromptValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
