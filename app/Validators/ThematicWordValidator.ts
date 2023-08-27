import { CustomMessages, schema, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const ThematicWordValidatorSchema = schema.create({
  words: schema.array().members(schema.string()),
})

export class ThematicWordValidator extends MyValidator<typeof ThematicWordValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return ThematicWordValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
