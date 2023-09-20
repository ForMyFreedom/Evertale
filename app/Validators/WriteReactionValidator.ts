import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { ReactionType, WriteReactionInsert } from '@ioc:forfabledomain'
import { SchemaTyper } from 'App/Utils/secure'

export const WriteReactionValidatorSchema: SchemaTyper<WriteReactionInsert> = schema.create({
  writeId: schema.number([rules.unsigned(), rules.exists({ table: 'writes', column: 'id' })]),
  type: schema.enum(Object.values(ReactionType) as ReactionType[]),
})

export class WriteReactionValidator extends MyValidator<
  typeof WriteReactionValidatorSchema
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof WriteReactionValidatorSchema {
    return WriteReactionValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
