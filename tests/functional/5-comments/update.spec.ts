import { TestContext } from '@japa/runner'
import { BASE_URL, EDIT_SAMPLE_COMMENT, postComment } from './_data'
import HTTP from 'http-status-enum'
import { ApiClient } from '@japa/api-client/build/src/client'
import { testPUTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPUTUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testPUTAccepted } from '../_utils/basic-tests/accepted'
import { ExceptionContract, putWithAuth } from '../_utils/basic-auth-requests'

async function testCommentUpdate({ client }: TestContext): Promise<void> {
  const adminComment = await postComment(client, true)
  const nonAdminComment = await postComment(client, false)

  await testPUTUnauthenticated(client, BASE_URL, adminComment.id, EDIT_SAMPLE_COMMENT)
  await testPUTUndefinedId(client, BASE_URL, EDIT_SAMPLE_COMMENT)

  await testPutOthersComment(client, BASE_URL, adminComment.id, EDIT_SAMPLE_COMMENT, ConnectionType.NonAdmin)
  await testPutOthersComment(client, BASE_URL, nonAdminComment.id, EDIT_SAMPLE_COMMENT, ConnectionType.Admin)

  await testPUTAccepted(client, BASE_URL, adminComment.id, EDIT_SAMPLE_COMMENT, ConnectionType.Admin)
  await testPUTAccepted(client, BASE_URL, nonAdminComment.id, EDIT_SAMPLE_COMMENT, ConnectionType.NonAdmin)
}

async function testPutOthersComment(client: ApiClient, url: string, commentId: number, body: object, isAdmin: ConnectionType): Promise<void> {
  let response = await putWithAuth(`${url}/${commentId}`, client, Boolean(isAdmin), body)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBody({ error: ExceptionContract.CantEditOthersWrite })
}

export default testCommentUpdate