import { TestContext } from '@japa/runner'
import { BASE_URL, postPrompt } from './_data'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testDELETEAccepted } from '../_utils/basic-tests/accepted'
import { testDELETEOthersWrite } from '../_utils/basic-tests/others-write'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testPromptDestroy({ client }: TestContext): Promise<void> {
  const prompt = await postPrompt(client, ConnectionType.Admin)
  const otherPrompt = await postPrompt(client, ConnectionType.NonAdmin)

  await testDELETEUnauthenticated(client, BASE_URL, prompt.id)
  await testDELETEUndefinedId(client, BASE_URL)
  await testDELETEOthersWrite(client, BASE_URL, otherPrompt.id)
  await testDELETEAccepted(client, BASE_URL, prompt.id)
}

export default testPromptDestroy