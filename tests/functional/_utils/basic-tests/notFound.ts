import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { RequestFunction, deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../basic-auth-requests"
import { ExceptionContract } from "../basic-auth-requests"

export async function testGETNotFound(client: ApiClient, url: string): Promise<void> {
  return await testREQUESTNotFound(getWithAuth, client, url)
}

export async function testPOSTNotFound(client: ApiClient, url: string, body: object): Promise<void> {
  return await testREQUESTNotFound(postWithAuth, client, url, body)
}

export async function testPUTNotFound(client: ApiClient, url: string, id: number, body: object): Promise<void> {
  return await testREQUESTNotFound(putWithAuth, client, `${url}/${id}`, body)
}

export async function testDELETENotFound(client: ApiClient, url: string, id: number): Promise<void> {
  return await testREQUESTNotFound(deleteWithAuth, client, `${url}/${id}`)
}

async function testREQUESTNotFound(
  requestFunction: RequestFunction, client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, true, body)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: ExceptionContract.NotFound })
}