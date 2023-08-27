import { TestContext } from '@japa/runner'
import { getWithAuth, postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, SAMPLE_GENRE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { serializate } from '../_utils/serializer'

async function testPromptShow({ client }: TestContext): Promise<void> {
  await postWithAuth(BASE_URL, client, SAMPLE_GENRE)

  await testBasicUnauthenticated(client)
  await testBasicUndefinedId(client)
  await testAdminAuthorized(client)
  await testNonAdminAuthorized(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.get(`${BASE_URL}/1`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testAdminAuthorized(client: ApiClient, isAdmin: boolean = true): Promise<void> {
  let response = await getWithAuth(`${BASE_URL}/1`, client, isAdmin)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains(
    { message: ExceptionContract.SucessfullyRecovered, data: serializate(SAMPLE_GENRE) }
  )
}

async function testNonAdminAuthorized(client: ApiClient): Promise<void> {
  return await testAdminAuthorized(client, false)
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await getWithAuth(`${BASE_URL}/99`, client)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

export default testPromptShow