import { TestContext } from '@japa/runner'
import { ApiClient } from '@japa/api-client/build/src/client'
import HTTP from 'http-status-enum'
import { BASE_URL, CONCLUSIVE_REACT_WRITE, OTHER_SAMPLE_REACT_WRITE, SAMPLE_REACT_WRITE, WRONG_SAMPLE_REACT_WRITE } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType, postWithAuth } from '../_utils/basic-auth-requests'
import { testOverReaction } from '../_utils/basic-tests/reaction-tests'
import { postProposal } from '../4-proposals/_data'
import { postPrompt } from '../3-prompts/_data'

async function testReactWriteStore({ client }: TestContext): Promise<void> {
  const prompt = await postPrompt(client)
  const proposal = await postProposal(client)

  const REACT_ON_PROMPT = {... SAMPLE_REACT_WRITE, writeId: prompt.writeId }
  const REACT_ON_PROPOSAL = {... SAMPLE_REACT_WRITE, writeId: proposal.writeId }

  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_REACT_WRITE)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_REACT_WRITE)

  await testCantUseConclusiveReactionInPrompt(client, BASE_URL, CONCLUSIVE_REACT_WRITE, ConnectionType.NonAdmin)
  await testCantReactYourself(client, BASE_URL, REACT_ON_PROMPT, ConnectionType.Admin)
  await testCantReactYourself(client, BASE_URL, REACT_ON_PROPOSAL, ConnectionType.Admin)

  await testPOSTAccepted(client, BASE_URL, REACT_ON_PROMPT, ConnectionType.NonAdmin)
  await testPOSTAccepted(client, BASE_URL, REACT_ON_PROPOSAL, ConnectionType.NonAdmin)

  await testOverReaction(
    client, BASE_URL, 1, SAMPLE_REACT_WRITE, OTHER_SAMPLE_REACT_WRITE, ConnectionType.NonAdmin
  )
}

async function testCantUseConclusiveReactionInPrompt(
  client: ApiClient, url: string, body: object, connectionType: ConnectionType
): Promise<void> {
  let response = await postWithAuth(url, client, connectionType, body)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: 'CantUseConclusiveReactionInPrompt' })
}

async function testCantReactYourself(
  client: ApiClient, url: string, body: object, connectionType: ConnectionType
): Promise<void> {
  let response = await postWithAuth(url, client, connectionType, body)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: 'CantReactYourself' })
}


export default testReactWriteStore