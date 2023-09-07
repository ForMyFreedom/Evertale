import { ApiRequest } from '@japa/api-client/build/src/request'
import { ApiClient } from '@japa/api-client/build/src/client'
import ExceptionHandler from 'App/Exceptions/Handler'
import { AdminCredentials, NonAdminCredentials } from './setup'

export const ExceptionContract =  ExceptionHandler.contract

export type BasicRequestFunction = (path: string) => ApiRequest
export type RequestFunction = (path: string, client: ApiClient, isAdmin?: boolean, body?: object) => Promise<ApiRequest>

export async function getWithAuth(path: string, client: ApiClient, isAdmin: boolean = true, _?: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.get.bind(client), isAdmin)
}

export async function deleteWithAuth(path: string, client: ApiClient, isAdmin: boolean = true, _?: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.delete.bind(client), isAdmin)
}

export async function putWithAuth(path: string, client: ApiClient, isAdmin: boolean = true, body: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.put.bind(client), isAdmin, body)
}
  
export async function postWithAuth(path: string, client: ApiClient, isAdmin: boolean = true, body: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.post.bind(client), isAdmin, body)    
}

export async function requestWithAuth(path: string, method: (endpoint: string) => ApiRequest, isAdmin: boolean, body: object = {}): Promise<ApiRequest> {
  const [name, password] = await getCredentials(isAdmin)
  return await method(path).basicAuth(name, password).json(body)
}

export async function requestWithUser(path: string, method: (endpoint: string) => ApiRequest, userName: string, password: string, body: object = {}): Promise<ApiRequest> {
  return await method(path).basicAuth(userName, password).json(body)
}

async function getCredentials(isAdmin: boolean): Promise<[string, string]> {
  if (isAdmin) {
    return [AdminCredentials.name, AdminCredentials.password]
  } else {
    return [NonAdminCredentials.name, NonAdminCredentials.password]
  }
}
