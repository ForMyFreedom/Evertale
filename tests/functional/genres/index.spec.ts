import { TestContext } from '@japa/runner'
import { ApiClient } from '@japa/api-client/build/src/client'
import { getWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, DEFAULT_BANK } from './_data'

async function testGenreIndex({ client }: TestContext): Promise<void> {
  await testBasicUnauthenticated(client)
  await testNonAdminAuthorized(client)
  await testBasicAccepted(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.get(BASE_URL)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testNonAdminAuthorized(client: ApiClient): Promise<void> {
  return await testBasicAccepted(client, false)
}

async function testBasicAccepted(client: ApiClient, isAdmin: boolean = true): Promise<void> {
  let response = await getWithAuth(BASE_URL, client, isAdmin)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyRecovered})
  response.assertBodyContains(DEFAULT_BANK)
}

export default testGenreIndex
