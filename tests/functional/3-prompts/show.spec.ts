import { TestContext } from '@japa/runner'
import { BASE_URL, postPrompt } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testPromptShow({ client }: TestContext): Promise<void> {
  const prompt = await postPrompt(client)
  const urlWithId = `${BASE_URL}/${prompt.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testPromptShow