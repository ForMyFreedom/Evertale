import { TestContext } from '@japa/runner'
import { deleteWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'

async function testUserDestroy({ client }: TestContext): Promise<void> {
  await testBasicUnauthenticated(client, 1)
  await testBasicUndefinedId(client)
  await testBlockWithoutAuthorship(client, 2, true)
  await testBasicAccepted(client, 2, false)
  await testBasicAccepted(client, 1, true)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.delete(`${BASE_URL}/${id}`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/99`, client)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBlockWithoutAuthorship(client: ApiClient, id: number, isAdmin: true): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, isAdmin)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantDeleteOtherUser})
}

async function testBasicAccepted(client: ApiClient, id: number, isAdmin: boolean): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, isAdmin)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyDestroyed})
}

export default testUserDestroy