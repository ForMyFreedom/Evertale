import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ConnectionType, RequestFunction, postWithAuth, putWithAuth } from "../basic-auth-requests"

export async function testPOSTUnacceptedBody(client: ApiClient, url: string, body: object, connectionType: ConnectionType = ConnectionType.Admin): Promise<void> {
  return await testREQUESTUnacceptedBody(postWithAuth, client, url, body, connectionType)
}

export async function testPUTUnacceptedBody(client: ApiClient, url: string, id: number, body: object, connectionType: ConnectionType = ConnectionType.Admin): Promise<void> {
  return await testREQUESTUnacceptedBody(putWithAuth, client, `${url}/${id}`, body, connectionType)
}

async function testREQUESTUnacceptedBody(
  requestFunction: RequestFunction,
  client: ApiClient, url: string, body: object, connectionType: ConnectionType
): Promise<void> {
  let response = await requestFunction(url, client, connectionType, body)
  response.assertStatus(HTTP.UNPROCESSABLE_ENTITY)
}