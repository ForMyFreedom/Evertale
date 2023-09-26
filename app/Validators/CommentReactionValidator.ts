import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { CommentReactionInsert, ReactionType } from '@ioc:forfabledomain'
import { SchemaTyper } from 'App/Utils/secure'

export const CommentReactionValidatorSchema: SchemaTyper<CommentReactionInsert> = schema.create({
  commentId: schema.number([rules.unsigned(), rules.exists({ table: 'comments', column: 'id' })]),
  type: schema.enum(Object.values(ReactionType)),
})

export class CommentReactionValidator extends MyValidator<
  typeof CommentReactionValidatorSchema
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof CommentReactionValidatorSchema {
    return CommentReactionValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
