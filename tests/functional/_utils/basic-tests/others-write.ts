import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ConnectionType, RequestFunction, deleteWithAuth, putWithAuth } from "../basic-auth-requests"
import { ExceptionContract } from "../basic-auth-requests"

export async function testPUTOthersWrite(client: ApiClient, url: string, id: number, body: object): Promise<void> {
  const message = { error: ExceptionContract.CantEditOthersWrite }
  const http = HTTP.UNAUTHORIZED
  return await testREQUESTCantEditOthersWrite(putWithAuth, message, http, client, `${url}/${id}`, body)
}

export async function testDELETEOthersWrite(client: ApiClient, url: string, id: number): Promise<void> {
  const message = { error: ExceptionContract.CantDeleteOthersWrite }
  const http = HTTP.UNAUTHORIZED
  return await testREQUESTCantEditOthersWrite(deleteWithAuth, message, http, client, `${url}/${id}`)
}

async function testREQUESTCantEditOthersWrite(
  requestFunction: RequestFunction, message: object,
  http: number, client: ApiClient, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url, client, ConnectionType.Admin, body)
  response.assertStatus(http)
  response.assertBody(message)
}