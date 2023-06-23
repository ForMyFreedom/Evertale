/* eslint-disable prettier/prettier */
import { validator, ParsedTypedSchema, TypedSchema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export abstract class MyParserValidator<TSchema extends ParsedTypedSchema<TypedSchema>, TTrue> {
    protected body: any

    constructor(protected ctx: HttpContextContract) {
        this.body = ctx.request.body()
    }

    public async validate(): Promise<TTrue> {
      return this.TrueCast(await validator.validate({ schema: this.GetSchema(), data: this.body, messages: this.messages }))
    }

    public messages: CustomMessages = {
        'thematicWords.regex': 'st',
        ...this.GetMessages(),
    }

    public abstract TrueCast(validatedBody: TSchema['props']): TTrue
    public abstract GetSchema(): TSchema
    protected abstract GetMessages(): CustomMessages

}

export abstract class MyBasicValidator<TSchema extends ParsedTypedSchema<TypedSchema>> extends MyParserValidator<TSchema, TSchema['props']> {
    constructor(protected ctx: HttpContextContract) {
        super(ctx)
    }

    public TrueCast(validatedBody: TSchema): TSchema['props'] {
        return validatedBody
    }

    public abstract GetSchema(): TSchema
    protected abstract GetMessages(): CustomMessages

}
