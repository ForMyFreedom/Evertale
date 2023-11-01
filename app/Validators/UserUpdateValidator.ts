import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { UserUpdate } from '@ioc:forfabledomain'


export const UserValidatorSchema: SchemaTyper<UserUpdate> = schema.create({
  name: schema.string(),
  nickname: schema.string(),
  imageUrl: schema.string({}, [rules.url()]),
  primaryColorHex: schema.string(),
  secondaryColorHex: schema.string(),
})

export class UserUpdateValidator extends MyValidator<typeof UserValidatorSchema> {
  constructor(protected ctx: HttpContextContract) {
    super(ctx)
  }

  public GetSchema(): typeof UserValidatorSchema {
    return UserValidatorSchema
  }

  protected GetMessages(): CustomMessages {
    return {}
  }
}
