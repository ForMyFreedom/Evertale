import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ConnectionType } from "../basic-auth-requests"
import { RequestFunction, deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testGETUnauthorized(client: ApiClient, url: string): Promise<void> {
  return await testREQUESTUnauthorized(getWithAuth, client, url)
}

export async function testPOSTUnauthorized(client: ApiClient, url: string, body: object): Promise<void> {
  return await testREQUESTUnauthorized(postWithAuth, client, url, body)
}

export async function testPUTUnauthorized(client: ApiClient, url: string, id: number, body: object): Promise<void> {
  return await testREQUESTUnauthorized(putWithAuth, client, `${url}/${id}`, body)
}

export async function testDELETEUnauthorized(client: ApiClient, url: string, id: number): Promise<void> {
  return await testREQUESTUnauthorized(deleteWithAuth, client, `${url}/${id}`)
}

async function testREQUESTUnauthorized(
  requestFunction: RequestFunction,
  client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, ConnectionType.NonAdmin, body)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: 'Unauthorized' })
}