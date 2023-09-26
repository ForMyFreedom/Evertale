import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { ThematicWordInsert } from '@ioc:forfabledomain'
import { SchemaTyper } from 'App/Utils/secure'

export const ThematicWordValidatorSchema: SchemaTyper<Omit<ThematicWordInsert, 'genreId'>> = schema.create({
  words: schema.array().members(schema.string())
})

export class ThematicWordValidator extends MyValidator<typeof ThematicWordValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof ThematicWordValidatorSchema {
    return ThematicWordValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
