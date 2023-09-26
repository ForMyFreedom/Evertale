import { validator, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schemaAsOptional } from 'App/Utils/schema';
import { SchemaTyper } from 'App/Utils/secure';

export abstract class MyValidator<TSchema extends SchemaTyper<any>> {
    protected body: any

    constructor(protected ctx: HttpContextContract) {
        this.body = ctx.request.body()
    }

    public async validate(): Promise<TSchema['props']> {
      const schema = this.GetSchema()
      return await validator.validate({ schema: schema, data: this.body, messages: this.messages })
    }

    public async validateAsOptional(): Promise<Partial<TSchema['props']>> {
        const schema = schemaAsOptional(this.GetSchema())
        return removeUndefineds(
            await validator.validate({ schema: schema, data: this.body, messages: this.messages })
        )
    }

    public messages: CustomMessages = {
        'date.format': '{{field}} it is not a date',
        ...this.GetMessages(),
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