import { TestContext } from '@japa/runner'
import { BASE_URL } from './_data'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testGenreIndex({ client }: TestContext): Promise<void> {
  // await testGETUnauthenticated(client, BASE_URL)
  // await testGETUnauthorized(client, BASE_URL)
  await testGETAccepted(client, BASE_URL, ConnectionType.Admin)
}

export default testGenreIndex
