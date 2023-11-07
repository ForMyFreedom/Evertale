import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ConnectionType, ExceptionContract } from "../basic-auth-requests"
import { RequestFunction, deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testGETUndefinedId(client: ApiClient, urlWithoutId: string): Promise<void> {
  return await testREQUESTUndefinedId(getWithAuth, client, urlWithoutId)
}

export async function testPOSTUndefinedId(client: ApiClient, urlWithoutId: string, body: object): Promise<void> {
  return await testREQUESTUndefinedId(postWithAuth, client, urlWithoutId, body)
}

export async function testPUTUndefinedId(client: ApiClient, urlWithoutId: string, body: object): Promise<void> {
  return await testREQUESTUndefinedId(putWithAuth, client, urlWithoutId, body)
}

export async function testDELETEUndefinedId(client: ApiClient, urlWithoutId: string): Promise<void> {
  return await testREQUESTUndefinedId(deleteWithAuth, client, urlWithoutId)
}

async function testREQUESTUndefinedId(
  requestFunction: RequestFunction,
  client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(`${url}/99`, client, ConnectionType.Admin, body)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}