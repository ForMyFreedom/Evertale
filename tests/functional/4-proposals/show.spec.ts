import { TestContext } from '@japa/runner'
import { BASE_URL, postProposal } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testProposalShow({ client }: TestContext): Promise<void> {
  const proposal = await postProposal(client)
  const urlWithId = `${BASE_URL}/${proposal.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testProposalShow