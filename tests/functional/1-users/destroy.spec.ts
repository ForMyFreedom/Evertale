import { TestContext } from '@japa/runner'
import { ConnectionType, deleteWithAuth, requestWithUser } from '../_utils/basic-auth-requests'
import HTTP from 'http-status-enum'
import { BASE_URL, ADMIN_USER_SAMPLE, NON_ADMIN_USER_SAMPLE, postUser } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import User from 'App/Models/User'

async function testUserDestroy({ client }: TestContext): Promise<void> {
  const adminUser = await postUser(client, ADMIN_USER_SAMPLE, true)
  const nonAdminUser = await postUser(client, NON_ADMIN_USER_SAMPLE, false)

  await testDELETEUndefinedId(client, BASE_URL)
  
  await testDELETEUnauthenticated(client, BASE_URL, adminUser.id)
  await testDELETEUnauthenticated(client, BASE_URL, nonAdminUser.id)
  
  await testBlockWithoutAuthorship(client, nonAdminUser.id, ConnectionType.NonAdmin)
  await testBlockWithoutAuthorship(client, adminUser.id, ConnectionType.Admin)

  await testDeleteUserAccepted(client, adminUser)
  await testDeleteUserAccepted(client, nonAdminUser)
}

async function testBlockWithoutAuthorship(
  client: ApiClient, id: number, connectionType: ConnectionType
): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, connectionType)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: 'CantDeleteOtherUser'})
}

async function testDeleteUserAccepted(client: ApiClient, user: User): Promise<void> {
  let response = await requestWithUser(
    `${BASE_URL}/${user.id}`,
    client.delete.bind(client),
    user
  )
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: 'SucessfullyDestroyed'})
}

export default testUserDestroy