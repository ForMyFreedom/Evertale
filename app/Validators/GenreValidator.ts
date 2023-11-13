import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { GenreInsert } from '@ioc:forfabledomain'

export const GenreValidatorSchema: SchemaTyper<GenreInsert> = schema.create({
  name: schema.string({}, [rules.unique({ table: 'genres', column: 'name' })]),
  imageUrl: schema.string([rules.url()]),
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
