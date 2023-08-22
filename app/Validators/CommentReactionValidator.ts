import { schema, CustomMessages, ParsedTypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { ReactionType } from 'App/Models/Reaction'

const CommentReactionValidatorSchema = schema.create({
  commentId: schema.number([rules.unsigned(), rules.exists({ table: 'comments', column: 'id' })]),
  type: schema.enum(Object.values(ReactionType) as ReactionType[]),
})

export default class CommentReactionValidator extends MyValidator<
  typeof CommentReactionValidatorSchema
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return CommentReactionValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
