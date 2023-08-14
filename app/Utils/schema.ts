/* eslint-disable prettier/prettier */
import { ParsedTypedSchema, TypedSchema } from '@ioc:Adonis/Core/Validator'

function schemaAsOptional(schemaObject: ParsedTypedSchema<TypedSchema>): ParsedTypedSchema<TypedSchema> {
  const updatedSchema = Object.assign({}, schemaObject)
  Object.keys(updatedSchema.tree).forEach((field) => {
    updatedSchema.tree[field].rules = updatedSchema.tree[field].rules.filter((rule)=> rule.name !== 'required')
  })
  return updatedSchema
}

export default schemaAsOptional
