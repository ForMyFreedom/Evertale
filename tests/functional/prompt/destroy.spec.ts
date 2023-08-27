import { TestContext } from '@japa/runner'
import { deleteWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'

async function testPromptDestroy({ client }: TestContext): Promise<void> {
  await testBasicUnauthenticated(client)
  await testBasicUndefinedId(client)
  await testBasicUnauthorized(client)
  await testBasicAccepted(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.delete(`${BASE_URL}/2`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/99`, client)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBasicAccepted(client: ApiClient): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/1`, client)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyDestroyed})
}

async function testBasicUnauthorized(client: ApiClient): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/1`, client, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

export default testPromptDestroy