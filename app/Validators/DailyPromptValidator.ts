import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { GainControlOverDailyPromptInsert } from '@ioc:forfabledomain'

const DailyPromptValidatorSchema: SchemaTyper<GainControlOverDailyPromptInsert> = schema.create({
  text: schema.string(),
  title: schema.string(),
})

export default class DailyPromptValidator extends MyValidator<typeof DailyPromptValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof DailyPromptValidatorSchema {
    return DailyPromptValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
