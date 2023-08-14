/* eslint-disable prettier/prettier */
import { validator, ParsedTypedSchema, TypedSchema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import schemaAsOptional from 'App/Utils/schema';

export abstract class MyParserValidator<TSchema extends ParsedTypedSchema<TypedSchema>, TTrue extends object> {
    protected body: any

    constructor(protected ctx: HttpContextContract) {
        this.body = ctx.request.body()
    }

    public async validate(): Promise<TTrue> {
      const schema = this.GetSchema()
      return this.TrueCast(await validator.validate({ schema: schema, data: this.body, messages: this.messages }))
    }

    public async validateAsOptional(): Promise<Partial<TTrue>> {
        const schema = schemaAsOptional(this.GetSchema())
        return removeUndefineds(
            this.TrueCast(await validator.validate({ schema: schema, data: this.body, messages: this.messages }))
        )
    }

    public messages: CustomMessages = {
        'date.format': '{{field}} it is not a date',
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


function removeUndefineds<T extends object>(data: T): Partial<T>|T {
    for (const key of Object.keys(data)) {
        if (data[key] === undefined){
            delete data[key]
        }
    }

    return data
}