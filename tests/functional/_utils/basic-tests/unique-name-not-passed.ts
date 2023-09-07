import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ExceptionContract } from "../basic-auth-requests"
import { RequestFunction, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testPOSTUniqueNameNotPassed(client: ApiClient, url: string, body: object): Promise<void> {
  return await testREQUESTUniqueNameNotPassed(postWithAuth, client, url, body)
}

export async function testPUTUniqueNameNotPassed(client: ApiClient, url: string, id: number, body: object): Promise<void> {
  return await testREQUESTUniqueNameNotPassed(putWithAuth, client, `${url}/${id}`, body)
}

async function testREQUESTUniqueNameNotPassed(
  requestFunction: RequestFunction,
  client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, true, body)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: ExceptionContract.BodyValidationFailure })
}