import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'

export const GenreValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'genres', column: 'name' })]),
  image: schema.string({}, [rules.url()]),
  thematicWords: schema.array().members(schema.string()),
})

export class GenreValidator extends MyValidator<typeof GenreValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof GenreValidatorSchema {
    return GenreValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
