import { TestContext } from '@japa/runner'
import { ApiClient } from '@japa/api-client/build/src/client'
import HTTP from 'http-status-enum'
import { BASE_URL, SAMPLE_REACT_COMMENT, WRONG_SAMPLE_REACT_COMMENT, CONCLUSIVE_REACT_COMMENT, OTHER_SAMPLE_REACT_COMMENT } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { ConnectionType, testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { ExceptionContract, postWithAuth } from '../_utils/basic-auth-requests'
import { testOverReaction } from '../_utils/basic-tests/reaction-tests'
import { postComment } from '../5-comments/_data'

async function testReactCommentStore({ client }: TestContext): Promise<void> {
  await postComment(client)

  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_REACT_COMMENT)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_REACT_COMMENT)

  await testCantUseConclusiveReactionInComment(client, BASE_URL, CONCLUSIVE_REACT_COMMENT)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_REACT_COMMENT, ConnectionType.Admin)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_REACT_COMMENT, ConnectionType.NonAdmin)

  await testOverReaction(
    client, BASE_URL, 1, SAMPLE_REACT_COMMENT, OTHER_SAMPLE_REACT_COMMENT, ConnectionType.Admin
  )
}

async function testCantUseConclusiveReactionInComment(
  client: ApiClient, url: string, body: object, isAdmin: boolean = true
): Promise<void> {
  let response = await postWithAuth(url, client, isAdmin, body)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: ExceptionContract.CantUseConclusiveReactionInComment })
}

export default testReactCommentStore