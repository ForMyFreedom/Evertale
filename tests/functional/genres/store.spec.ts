import { TestContext } from '@japa/runner'
import { postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { serializate } from '../_utils/serializer'
import { BASE_URL, ExceptionContract, SAMPLE_GENRE, WRONG_SAMPLE_GENRE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'

async function testGenreStore({ client }: TestContext): Promise<void> {
  await testBasicUnauthenticated(client)
  await testBasicUnacceptedBody(client)
  await testBasicUnauthorized(client)
  await testBasicAccepted(client)
  await testUniqueName(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.post(BASE_URL).json(SAMPLE_GENRE)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUnauthorized(client: ApiClient): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, SAMPLE_GENRE, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

async function testBasicUnacceptedBody(client: ApiClient): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, WRONG_SAMPLE_GENRE)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({error: ExceptionContract.BodyValidationFailure})
}

async function testBasicAccepted(client: ApiClient): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  response.assertStatus(HTTP.CREATED)
  response.assertBodyContains({ message: ExceptionContract.SucessfullyCreated, data: serializate(SAMPLE_GENRE) })
}

async function testUniqueName(client: ApiClient): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({ error: ExceptionContract.BodyValidationFailure })
}

export default testGenreStore