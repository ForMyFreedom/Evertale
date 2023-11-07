import { TestContext } from '@japa/runner'
import { BASE_URL, SAMPLE_PROMPT, WRONG_SAMPLE_PROMPT } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { postGenre } from '../2-genres/_data'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testPromptStore({ client }: TestContext): Promise<void> {
  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_PROMPT)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_PROMPT)
  SAMPLE_PROMPT.genreIds = []
  await testPOSTUnacceptedBody(client, BASE_URL, SAMPLE_PROMPT)
  await testPOSTUnacceptedBody(client, BASE_URL, SAMPLE_PROMPT)
  const genre = await postGenre(client)
  SAMPLE_PROMPT.genreIds.push(genre.id)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_PROMPT, ConnectionType.Admin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_PROMPT, ConnectionType.NonAdmin)
}

export default testPromptStore