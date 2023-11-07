import { TestContext } from '@japa/runner'
import { BASE_URL, postUser, NON_ADMIN_USER_SAMPLE } from './_data'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testUserShow({ client }: TestContext): Promise<void> {
  const user = await postUser(client, NON_ADMIN_USER_SAMPLE)
  const urlWithId = `${BASE_URL}/${user.id}`

  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.NotConnected)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testUserShow