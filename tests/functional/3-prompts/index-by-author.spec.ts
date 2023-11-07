import { TestContext } from '@japa/runner'
import { BASE_URL, postPrompt } from './_data'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testIndexByAuthor({ client }: TestContext): Promise<void> {
  await postPrompt(client, ConnectionType.Admin)
  const url = `${BASE_URL}/author/1`

  await testGETAccepted(client, url, ConnectionType.NotConnected)
  await testGETAccepted(client, url, ConnectionType.Admin)
  await testGETAccepted(client, url, ConnectionType.NonAdmin)
}

export default testIndexByAuthor