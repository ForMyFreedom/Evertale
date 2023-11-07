import { TestContext } from '@japa/runner'
import { BASE_URL, EDIT_SAMPLE_PROMPT, postPrompt } from './_data'
import { testPUTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPUTUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testPUTOthersWrite } from '../_utils/basic-tests/others-write'
import { testPUTAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testPromptUpdate({ client }: TestContext): Promise<void> {
  const prompt = await postPrompt(client, ConnectionType.Admin)
  const otherPrompt = await postPrompt(client, ConnectionType.NonAdmin)

  await testPUTUnauthenticated(client, BASE_URL, prompt.id, EDIT_SAMPLE_PROMPT)
  await testPUTUndefinedId(client, BASE_URL, EDIT_SAMPLE_PROMPT)
  await testPUTOthersWrite(client, BASE_URL, otherPrompt.id, EDIT_SAMPLE_PROMPT)
  await testPUTAccepted(client, BASE_URL, prompt.id, EDIT_SAMPLE_PROMPT)
}

export default testPromptUpdate