import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const ConstantsValidatorSchema = schema.create({
  strengthOfPositiveOpinion: schema.number([rules.unsigned()]),
  negativeOpinionStrength: schema.number([rules.unsigned()]),
  deleteStrength: schema.number([rules.unsigned()]),
  completionPercentage: schema.number([rules.percentage()]),
  exclusionPercentage: schema.number([rules.percentage()]),
  banLimit: schema.number([rules.negative()])
})

export class ConstantsValidator extends MyValidator<typeof ConstantsValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof ConstantsValidatorSchema {
    return ConstantsValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
