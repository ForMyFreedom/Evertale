import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ExceptionContract } from "../basic-auth-requests"
import { RequestFunction, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testPOSTUnacceptedBody(client: ApiClient, url: string, body: object, isAdmin: boolean = true): Promise<void> {
  return await testREQUESTUnacceptedBody(postWithAuth, client, url, body, isAdmin)
}

export async function testPUTUnacceptedBody(client: ApiClient, url: string, id: number, body: object, isAdmin: boolean = true): Promise<void> {
  return await testREQUESTUnacceptedBody(putWithAuth, client, `${url}/${id}`, body, isAdmin)
}

async function testREQUESTUnacceptedBody(
  requestFunction: RequestFunction,
  client: ApiClient, url: string, body: object, isAdmin: boolean
): Promise<void> {
  let response = await requestFunction(url, client, isAdmin, body)
  response.assertStatus(HTTP.UNPROCESSABLE_ENTITY)
  response.assertBodyContains({error: ExceptionContract.BodyValidationFailure})
}