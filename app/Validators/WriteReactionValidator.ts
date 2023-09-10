import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { ReactionType } from 'App/Models/Reaction'

export const WriteReactionValidatorSchema = schema.create({
  writeId: schema.number([rules.unsigned(), rules.exists({ table: 'writes', column: 'id' })]),
  type: schema.enum(Object.values(ReactionType) as string[]),
})

export class WriteReactionValidator extends MyValidator<
  typeof WriteReactionValidatorSchema
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return WriteReactionValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
