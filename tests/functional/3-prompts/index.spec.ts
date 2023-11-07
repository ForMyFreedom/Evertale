import { TestContext } from '@japa/runner'
import { BASE_URL } from './_data'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testPromptIndex({ client }: TestContext): Promise<void> {
  await testGETAccepted(client, BASE_URL, ConnectionType.NotConnected)
  await testGETAccepted(client, BASE_URL, ConnectionType.Admin)
  await testGETAccepted(client, BASE_URL, ConnectionType.NonAdmin)
}

export default testPromptIndex
