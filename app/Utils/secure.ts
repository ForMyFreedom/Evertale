/* eslint-disable prettier/prettier */
import { schema, rules, ParsedTypedSchema, SchemaLiteral } from '@ioc:Adonis/Core/Validator'

export function randomSalt(): number { 
  return Math.random() * 10000
}

export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/

export type SchemaTyper<T> = ParsedTypedSchema<
    {[Prop in keyof T]: {t: T[Prop], getTree(): SchemaLiteral}}
>

export const PasswordSchema = {
  password: schema.string([rules.regex(PASSWORD_REGEX)]),
  repeatPassword: schema.string([rules.confirmed('password')]),
}