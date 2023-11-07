import { TestContext } from '@japa/runner'
import { BASE_URL, postReactWrite } from './_data'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testDELETEAccepted } from '../_utils/basic-tests/accepted'
import { testDELETEOthersReaction } from '../_utils/basic-tests/reaction-tests'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testReactWriteUpdate({ client }: TestContext): Promise<void> {
  const adminReactPrompt = await postReactWrite(client, true, true)
  const adminReactProposal = await postReactWrite(client, true, false)
  const nonAdminReactPrompt = await postReactWrite(client, false, true)
  const nonAdminReactProposal = await postReactWrite(client, false, false)

  await testDELETEUnauthenticated(client, BASE_URL, adminReactPrompt.id)
  await testDELETEUndefinedId(client, BASE_URL)

  await testDELETEOthersReaction(client, BASE_URL, adminReactPrompt.id, ConnectionType.NonAdmin)
  await testDELETEOthersReaction(client, BASE_URL, adminReactProposal.id, ConnectionType.NonAdmin)
  await testDELETEOthersReaction(client, BASE_URL, nonAdminReactPrompt.id, ConnectionType.Admin)
  await testDELETEOthersReaction(client, BASE_URL, nonAdminReactProposal.id, ConnectionType.Admin)

  await testDELETEAccepted(client, BASE_URL, adminReactPrompt.id, ConnectionType.Admin)
  await testDELETEAccepted(client, BASE_URL, adminReactProposal.id, ConnectionType.Admin)
  await testDELETEAccepted(client, BASE_URL, nonAdminReactPrompt.id, ConnectionType.NonAdmin)
  await testDELETEAccepted(client, BASE_URL, nonAdminReactProposal.id, ConnectionType.NonAdmin)
}

export default testReactWriteUpdate