import { TestContext } from '@japa/runner'
import { ApiClient } from '@japa/api-client/build/src/client'
import HTTP from 'http-status-enum'
import { BASE_URL, WORDS_SAMPLE, postGenre } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { ExceptionContract, postWithAuth } from '../_utils/basic-auth-requests'

async function testGenreInsertWords({ client }: TestContext): Promise<void> {
  const genre = await postGenre(client)
  const urlWithId = `${BASE_URL}/${genre.id}/word`

  await testPOSTUnauthenticated(client, urlWithId, WORDS_SAMPLE)
  await testPOSTUnauthorized(client, urlWithId, WORDS_SAMPLE)
  await testWORDUndefinedId(client, BASE_URL, WORDS_SAMPLE)
  await testPOSTUnacceptedBody(client, urlWithId, {})         // Blank
  await testPOSTUnacceptedBody(client, urlWithId, [1,2,3])    // Wrong Type
  await testPOSTAccepted(client, urlWithId, WORDS_SAMPLE)
}

async function testWORDUndefinedId(client: ApiClient, url: string, body: object): Promise<void> {
  let response = await postWithAuth(`${url}/99/word`, client, true, body)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}


export default testGenreInsertWords