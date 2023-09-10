import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { RequestFunction, deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../basic-auth-requests"
import { ExceptionContract } from "../basic-auth-requests"

export enum ConnectionType {
  NonAdmin = 0,
  Admin = 1
}

export async function testGETAccepted(
  client: ApiClient, url: string, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: ExceptionContract.SucessfullyRecovered }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(getWithAuth, connectionType, message, http, client, url)
}

export async function testPOSTAccepted(
  client: ApiClient, url: string, body: object, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: ExceptionContract.SucessfullyCreated }
  const http = HTTP.CREATED
  return await testREQUESTAccepted(postWithAuth, connectionType, message, http, client, url, body)
}

export async function testPUTAccepted(
  client: ApiClient, url: string, id: number, body: object, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: ExceptionContract.SucessfullyUpdated }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(putWithAuth, connectionType, message, http, client, `${url}/${id}`, body)
}

export async function testDELETEAccepted(
  client: ApiClient, url: string, id: number, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { message: ExceptionContract.SucessfullyDestroyed }
  const http = HTTP.ACCEPTED
  return await testREQUESTAccepted(deleteWithAuth, connectionType, message, http, client, `${url}/${id}`)
}

async function testREQUESTAccepted(
  requestFunction: RequestFunction, connectionType: ConnectionType, message: object,
  http: number, client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, Boolean(connectionType), body)
  response.assertStatus(http)
  response.assertBodyContains(message)
}