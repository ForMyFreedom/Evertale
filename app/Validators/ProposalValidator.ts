import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { ProposalInsert } from '@ioc:forfabledomain'

export const ProposalValidatorSchema: SchemaTyper<ProposalInsert> = schema.create({
  text: schema.string(),
  promptId: schema.number(),
})

export class ProposalValidator extends MyValidator<typeof ProposalValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof ProposalValidatorSchema {
    return ProposalValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
