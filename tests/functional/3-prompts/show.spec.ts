import { TestContext } from '@japa/runner'
import { BASE_URL, postPrompt } from './_data'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testPromptShow({ client }: TestContext): Promise<void> {
  const prompt = await postPrompt(client)
  const urlWithId = `${BASE_URL}/${prompt.id}`

  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.NotConnected)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testPromptShow