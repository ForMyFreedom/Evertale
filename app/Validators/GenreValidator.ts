import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { NUMBER_REGEX, STRING_ARRAY_REGEX } from 'App/Utils/regex'
import { MyParserValidator } from './MyValidators'

const GenreValidatorSchema = schema.create({
  name: schema.string({}, [rules.unique({ table: 'genres', column: 'name' })]),
  popularity: schema.string({}, [rules.regex(NUMBER_REGEX)]),
  thematicWords: schema.string({}, [rules.regex(STRING_ARRAY_REGEX)]),
})

type GenreInputType = { name: string; popularity: number; thematicWords: string[] }

export default class GenreValidator extends MyParserValidator<
  typeof GenreValidatorSchema,
  GenreInputType
> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public TrueCast(validatedBody: (typeof GenreValidatorSchema)['props']): GenreInputType {
    return {
      name: validatedBody.name,
      popularity: Number(validatedBody.popularity ?? 0),
      thematicWords: JSON.parse(validatedBody.thematicWords ?? '[]'),
    }
  }

  public GetSchema(): typeof GenreValidatorSchema {
    return GenreValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {
      'thematicWords.regex': 'Is not an valid array',
      'popularity.regex': 'Is not a valid number',
    }
  }
}
