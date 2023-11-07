import { TestContext } from '@japa/runner'
import { BASE_URL, postComment } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testCommentIndexByWrite({ client }: TestContext): Promise<void> {
  const comment = await postComment(client)
  const url = `${BASE_URL}-by-write`
  const urlWithId = `${url}/${comment.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, url)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testCommentIndexByWrite