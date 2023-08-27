import { TestContext } from '@japa/runner'
import { putWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, EDIT_NON_ADMIN_USER } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'

async function testUserUpdate({ client }: TestContext): Promise<void> {
  await testBasicUnauthenticated(client)
  await testBasicUnauthorized(client)
  await testBlockWithoutAuthorship(client)
  await testBasicUndefinedId(client)
  await testBasicAccepted(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.put(`${BASE_URL}/2`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUnauthorized(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/2`, client, EDIT_NON_ADMIN_USER, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

async function testBlockWithoutAuthorship(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/2`, client, EDIT_NON_ADMIN_USER)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantEditOtherUser})
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/99`, client, EDIT_NON_ADMIN_USER)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBasicAccepted(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/1`, client, EDIT_NON_ADMIN_USER)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyUpdated})
}

export default testUserUpdate