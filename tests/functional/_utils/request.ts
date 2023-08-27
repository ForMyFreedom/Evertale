import { ApiRequest } from '@japa/api-client/build/src/request'
import { ApiClient } from '@japa/api-client/build/src/client'
import Env from '@ioc:Adonis/Core/Env'

export async function getWithAuth(path: string, client: ApiClient, isAdmin: boolean = true): Promise<ApiRequest> {
  return await requestWithAuth(path, client.get.bind(client), isAdmin)
}

export async function deleteWithAuth(path: string, client: ApiClient, isAdmin: boolean = true): Promise<ApiRequest> {
  return await requestWithAuth(path, client.delete.bind(client), isAdmin)
}

export async function putWithAuth(path: string, client: ApiClient, body: object, isAdmin: boolean = true): Promise<ApiRequest> {
  return await requestWithAuth(path, client.put.bind(client), isAdmin, body)
}
  
export async function postWithAuth(path: string, client: ApiClient, body: object, isAdmin: boolean = true): Promise<ApiRequest> {
  return await requestWithAuth(path, client.post.bind(client), isAdmin, body)    
}

async function requestWithAuth(path: string, method: (endpoint: string) => ApiRequest, isAdmin: boolean, body: object = {}): Promise<ApiRequest> {
  const [name, password] = await getCredentials(isAdmin)
  return await method(path).basicAuth(name, password).json(body)
}

async function getCredentials(isAdmin: boolean): Promise<[string, string]> {
  if (isAdmin) {
    return ['root', Env.get('USER_ROOT_PASSWORD')]
  } else {
    return ['non-root', Env.get('USER_ROOT_PASSWORD')]
  }
}
