import { TestContext } from '@japa/runner'
import { ApiClient } from '@japa/api-client/build/src/client'
import HTTP from 'http-status-enum'
import { BASE_URL, SAMPLE_COMMENT, SAMPLE_COMMENT_ANSWER, WRONG_SAMPLE_COMMENT } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { ConnectionType, testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { postPrompt } from '../3-prompts/_data'
import { ExceptionContract, postWithAuth } from '../_utils/basic-auth-requests'

async function testCommentStore({ client }: TestContext): Promise<void> {
  const write = await postPrompt(client)
  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_COMMENT)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_COMMENT)
  await testCommentNotDefined(client, BASE_URL, SAMPLE_COMMENT_ANSWER)

  SAMPLE_COMMENT.writeId = -1
  await testWriteNotDefined(client, BASE_URL, SAMPLE_COMMENT)
  SAMPLE_COMMENT.writeId = write.id

  await testPOSTAccepted(client, BASE_URL, SAMPLE_COMMENT, ConnectionType.Admin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_COMMENT, ConnectionType.NonAdmin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_COMMENT_ANSWER, ConnectionType.Admin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_COMMENT_ANSWER, ConnectionType.NonAdmin)
}

async function testWriteNotDefined(
  client: ApiClient, url: string, body: object, isAdmin: boolean = true
): Promise<void> {
  let response = await postWithAuth(url, client, isAdmin, body)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBodyContains({error: ExceptionContract.UndefinedWrite})
}

async function testCommentNotDefined(
  client: ApiClient, url: string, body: object, isAdmin: boolean = true
): Promise<void> {
  let response = await postWithAuth(url, client, isAdmin, body)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBodyContains({error: ExceptionContract.UndefinedComment})
}

export default testCommentStore