import HTTP from "http-status-enum"
import { ApiClient } from '@japa/api-client/build/src/client'
import { RequestFunction, deleteWithAuth, postWithAuth } from "../basic-auth-requests"
import { ExceptionContract } from "../basic-auth-requests"
import { ReactionType } from "@ioc:forfabledomain"

export enum ConnectionType {
  NonAdmin = 0,
  Admin = 1
}

export async function testOverReaction(client: ApiClient, url: string, id: number, firstBody: {type: ReactionType}, secondBody: {type: ReactionType}, connectionType: ConnectionType = ConnectionType.Admin) {
  await deleteWithAuth(`${url}/${id}`, client, Boolean(connectionType))
  await postWithAuth(url, client, Boolean(connectionType), firstBody)
  const response = await postWithAuth(url, client, Boolean(connectionType), secondBody)
  response.assertStatus(HTTP.CREATED)
  response.assertBodyContains({data: {type: secondBody.type}})
}


export async function testDELETEOthersReaction(
  client: ApiClient, url: string, id: number, connectionType: ConnectionType = ConnectionType.Admin
): Promise<void> {
  const message = { error: ExceptionContract.CantDeleteOthersReaction }
  const http = HTTP.UNAUTHORIZED
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