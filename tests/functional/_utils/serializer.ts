import { string } from '@ioc:Adonis/Core/Helpers'

export function serializate(body: object): object {
  const newBody = {}
  for(const prop of Object.keys(body)) {
    newBody[string.snakeCase(prop)] = body[prop]
  }
  return newBody
}

export function reverseSerializate(body: object): object {
  const newBody = {}
  for(const prop of Object.keys(body)) {
    newBody[string.camelCase(prop)] = body[prop]
  }
  return newBody
}