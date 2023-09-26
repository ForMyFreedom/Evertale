import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { CommentInsert } from '@ioc:forfabledomain'

export const CommentValidatorSchema: SchemaTyper<CommentInsert> = schema.create({
  writeId: schema.number(),
  answerToId: schema.number.nullable(),
  text: schema.string(),
  imageUrl: schema.string.nullable([rules.url()]),
})

export class CommentValidator extends MyValidator<typeof CommentValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof CommentValidatorSchema {
    return CommentValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
