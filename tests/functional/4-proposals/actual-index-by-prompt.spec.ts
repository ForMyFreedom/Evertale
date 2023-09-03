import { TestContext } from '@japa/runner'
import { BASE_URL, postProposal } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testActualProposalIndexByPrompt({ client }: TestContext): Promise<void> {
  const proposal = await postProposal(client)
  const url = `${BASE_URL}s-by-prompt/${proposal.id}/actual`
  await testGETUnauthenticated(client, url)
  await testGETAccepted(client, url, ConnectionType.Admin)
  await testGETAccepted(client, url, ConnectionType.NonAdmin)
}

export default testActualProposalIndexByPrompt
