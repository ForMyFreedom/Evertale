import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { ExceptionContract } from "../basic-auth-requests"
import { BasicRequestFunction } from "../basic-auth-requests"

export async function testGETUnauthenticated(client: ApiClient, url: string): Promise<void> {
  return await testREQUESTUnauthenticated(client.get.bind(client), url)
}

export async function testPOSTUnauthenticated(client: ApiClient, url: string, body: object): Promise<void> {
  return await testREQUESTUnauthenticated(client.post.bind(client), url, body)
}

export async function testPUTUnauthenticated(client: ApiClient, url: string, id: number, body: object): Promise<void> {
  return await testREQUESTUnauthenticated(client.put.bind(client), `${url}/${id}`, body)
}

export async function testDELETEUnauthenticated(client: ApiClient, url: string, id: number): Promise<void> {
  return await testREQUESTUnauthenticated(client.delete.bind(client), `${url}/${id}`)
}

async function testREQUESTUnauthenticated(
  requestFunction: BasicRequestFunction, url: string, body?: object
): Promise<void> {
  let response = await requestFunction(url).json(body ?? {})
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthenticated })
}