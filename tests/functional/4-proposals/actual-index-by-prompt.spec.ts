import { TestContext } from '@japa/runner'
import { BASE_URL, postProposal } from './_data'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testActualProposalIndexByPrompt({ client }: TestContext): Promise<void> {
  const proposal = await postProposal(client)
  const url = `${BASE_URL}/prompt/${proposal.prompt.id}/actual`

  await testGETAccepted(client, url, ConnectionType.Admin)
  await testGETAccepted(client, url, ConnectionType.NonAdmin)
  await testGETAccepted(client, url, ConnectionType.NotConnected)
}

export default testActualProposalIndexByPrompt
