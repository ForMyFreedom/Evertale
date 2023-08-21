import { schema, CustomMessages, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

const ProposalValidatorSchema = schema.create({
  text: schema.string(),
  promptId: schema.number(),
  popularity: schema.number.optional(),
})

export default class ProposalValidator extends MyValidator<typeof ProposalValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return ProposalValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
