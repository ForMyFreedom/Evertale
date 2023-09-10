import { TestContext } from '@japa/runner'
import { BASE_URL, postProposal } from './_data'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testDELETEAccepted } from '../_utils/basic-tests/accepted'
import { testDELETEOthersWrite } from '../_utils/basic-tests/others-write'

async function testProposalDestroy({ client }: TestContext): Promise<void> {
  const proposal = await postProposal(client, true)
  const otherProposal = await postProposal(client, false)

  await testDELETEUnauthenticated(client, BASE_URL, proposal.id)
  await testDELETEUndefinedId(client, BASE_URL)
  await testDELETEOthersWrite(client, BASE_URL, otherProposal.id)
  await testDELETEAccepted(client, BASE_URL, proposal.id)
}

export default testProposalDestroy