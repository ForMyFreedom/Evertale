import { TestContext } from '@japa/runner'
import { BASE_URL } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testPromptIndex({ client }: TestContext): Promise<void> {
  await testGETUnauthenticated(client, BASE_URL)
  await testGETAccepted(client, BASE_URL, ConnectionType.Admin)
  await testGETAccepted(client, BASE_URL, ConnectionType.NonAdmin)
}

export default testPromptIndex
