export async function serializate(body: object): Promise<object> {
  const newBody = {}
  for(const prop of Object.keys(body)) {
    newBody[camelToSnakeCase(prop)] = body[prop]
  }
  return newBody
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)