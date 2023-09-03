import { TestContext } from '@japa/runner'
import { BASE_URL, SAMPLE_PROPOSAL, WRONG_SAMPLE_PROPOSAL } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { ConnectionType, testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { postPrompt } from '../3-prompts/_data'
import { testPOSTNotFound } from '../_utils/basic-tests/notFound'

async function testProposalStore({ client }: TestContext): Promise<void> {
  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_PROPOSAL)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_PROPOSAL)
  SAMPLE_PROPOSAL.promptId = -1
  await testPOSTNotFound(client, BASE_URL, SAMPLE_PROPOSAL)
  const prompt = await postPrompt(client)
  SAMPLE_PROPOSAL.promptId = prompt.id
  await testPOSTAccepted(client, BASE_URL, SAMPLE_PROPOSAL, ConnectionType.Admin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_PROPOSAL, ConnectionType.NonAdmin)
}

export default testProposalStore