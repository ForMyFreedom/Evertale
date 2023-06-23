import { CustomMessages, schema, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyBasicValidator } from './MyValidators'

const ThematicWordValidatorSchema = schema.create({
  words: schema.array().members(schema.string()),
})

export default class ThematicWordValidator extends MyBasicValidator<
  typeof ThematicWordValidatorSchema
> {
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
