import { ApiRequest } from '@japa/api-client/build/src/request'
import { ApiClient } from '@japa/api-client/build/src/client'
import AdonisExceptionHandler from 'App/Exceptions/Handler'
import { AdminCredentials, NonAdminCredentials } from './setup'
import User from 'App/Models/User'

export const ExceptionContract =  AdonisExceptionHandler.contract

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
  const user = await getTemplateUser(isAdmin)
  return await method(path).loginAs(user).json(body)
}

export async function requestWithUser(path: string, method: (endpoint: string) => ApiRequest, user: User, body: object = {}): Promise<ApiRequest> {
  return await method(path).loginAs(user).json(body)
}

async function getTemplateUser(isAdmin: boolean): Promise<User> {
  if (isAdmin) {
    return User.findByOrFail('email', AdminCredentials.email)
  } else {
    return User.findByOrFail('email', NonAdminCredentials.email)
  }
}

