import { TestContext } from '@japa/runner'
import { BASE_URL, postReactComment } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testIndexByComment({ client }: TestContext): Promise<void> {
  const reactComment = await postReactComment(client)
  const urlWithId = `${BASE_URL}/${reactComment.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testIndexByComment