import { ApiRequest } from '@japa/api-client/build/src/request'
import { ApiClient } from '@japa/api-client/build/src/client'
import AdonisResponseHandler from 'App/Exceptions/Handler'
import { AdminCredentials, NonAdminCredentials } from './setup'
import User from 'App/Models/User'

export enum ConnectionType {
  NonAdmin = 0,
  Admin = 1,
  NotConnected = 2
}

export const ExceptionContract =  AdonisResponseHandler.contract

export type BasicRequestFunction = (path: string) => ApiRequest
export type RequestFunction = (path: string, client: ApiClient, connectionType: ConnectionType, body?: object) => Promise<ApiRequest>

export async function getWithAuth(path: string, client: ApiClient, connectionType: ConnectionType, _?: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.get.bind(client), connectionType)
}

export async function deleteWithAuth(path: string, client: ApiClient, connectionType: ConnectionType, _?: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.delete.bind(client), connectionType)
}

export async function putWithAuth(path: string, client: ApiClient, connectionType: ConnectionType, body: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.put.bind(client), connectionType, body)
}
  
export async function postWithAuth(path: string, client: ApiClient, connectionType: ConnectionType, body: object): Promise<ApiRequest> {
  return await requestWithAuth(path, client.post.bind(client), connectionType, body)    
}

export async function requestWithAuth(path: string, method: (endpoint: string) => ApiRequest, connectionType: ConnectionType, body: object = {}): Promise<ApiRequest> {
  if(connectionType === ConnectionType.NotConnected) {
    return await method(path).json(body)
  } else {
    const user = await getTemplateUser(Boolean(connectionType) as boolean)
    return await method(path).loginAs(user).json(body)
  }
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

