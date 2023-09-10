import { schema, CustomMessages, rules, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const CommentValidatorSchema = schema.create({
  writeId: schema.number(),
  answerToId: schema.number.optional(),
  text: schema.string(),
  imageUrl: schema.string.nullableAndOptional([rules.url()]),
})

export class CommentValidator extends MyValidator<typeof CommentValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): ParsedTypedSchema<any> {
    return CommentValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
