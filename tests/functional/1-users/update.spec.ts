import { TestContext } from '@japa/runner'
import { ExceptionContract, putWithAuth, requestWithUser } from '../_utils/basic-auth-requests'
import HTTP from 'http-status-enum'
import { ADMIN_USER_SAMPLE, BASE_URL, EDIT_NON_ADMIN_USER, NON_ADMIN_USER_SAMPLE, postUser } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { testPUTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPUTUndefinedId } from '../_utils/basic-tests/undefined-id'
import User from 'App/Models/User'

async function testUserUpdate({ client }: TestContext): Promise<void> {
  const adminUser = await postUser(client, ADMIN_USER_SAMPLE, true)
  const nonAdminUser = await postUser(client, NON_ADMIN_USER_SAMPLE, false)

  await testPUTUnauthenticated(client, BASE_URL, adminUser.id, EDIT_NON_ADMIN_USER)
  await testEditUserUnauthorized(client, nonAdminUser, NON_ADMIN_USER_SAMPLE)
  await testBlockWithoutAuthorship(client, adminUser.id)
  await testPUTUndefinedId(client, BASE_URL, EDIT_NON_ADMIN_USER)
  await testEditUserAccepted(client, adminUser, EDIT_NON_ADMIN_USER)
}

async function testBlockWithoutAuthorship(client: ApiClient, id: number): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/${id}`, client, true, EDIT_NON_ADMIN_USER)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantEditOtherUser})
}

async function testEditUserUnauthorized(client: ApiClient, user: User, body: object): Promise<void> {
  let response = await requestWithUser(
    `${BASE_URL}/${user.id}`, client.put.bind(client),
    user, body
  )
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.Unauthorized})
}

async function testEditUserAccepted(client: ApiClient, user: User, body: object): Promise<void> {
  let response = await requestWithUser(
    `${BASE_URL}/${user.id}`, client.put.bind(client),
    user, body
  )
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyUpdated})
}

export default testUserUpdate