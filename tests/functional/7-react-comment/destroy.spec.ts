import { TestContext } from '@japa/runner'
import { BASE_URL, postReactComment } from './_data'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testDELETEAccepted } from '../_utils/basic-tests/accepted'
import { testDELETEOthersReaction } from '../_utils/basic-tests/reaction-tests'

async function testReactCommentUpdate({ client }: TestContext): Promise<void> {
  const adminReact = await postReactComment(client, true)
  const nonAdminReact = await postReactComment(client, false)

  await testDELETEUnauthenticated(client, BASE_URL, adminReact.id)
  await testDELETEUndefinedId(client, BASE_URL)

  await testDELETEOthersReaction(client, BASE_URL, adminReact.id, ConnectionType.NonAdmin)
  await testDELETEOthersReaction(client, BASE_URL, nonAdminReact.id, ConnectionType.Admin)

  await testDELETEAccepted(client, BASE_URL, adminReact.id, ConnectionType.Admin)
  await testDELETEAccepted(client, BASE_URL, nonAdminReact.id, ConnectionType.NonAdmin)
}

export default testReactCommentUpdate