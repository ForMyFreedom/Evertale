import { TestContext } from '@japa/runner'
import { postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { serializate } from '../_utils/serializer'
import { BASE_URL, ExceptionContract, SAMPLE_PROMPT, WRONG_SAMPLE_PROMPT } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { SAMPLE_GENRE, BASE_URL as BASE_GENRE_URL } from '../genres/_data'
import Genre from 'App/Models/Genre'

async function testPromptStore({ client }: TestContext): Promise<void> {
  const toUseGenreResponse = await postWithAuth(BASE_GENRE_URL, client, SAMPLE_GENRE)
  const genre = toUseGenreResponse.body().data as Genre

  SAMPLE_PROMPT.genreIds = [genre.id]

  await testBasicUnauthenticated(client)
  await testBasicUnacceptedBody(client)
  await testAdminAuthorized(client)
  await testNonAdminAuthorized(client)
}

async function testBasicUnauthenticated(client: ApiClient): Promise<void> {
  let response = await client.post(BASE_URL).json(SAMPLE_PROMPT)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUnacceptedBody(client: ApiClient): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, WRONG_SAMPLE_PROMPT)
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({error: ExceptionContract.BodyValidationFailure})
}

async function testAdminAuthorized(client: ApiClient, isAdmin: boolean = true): Promise<void> {
  let response = await postWithAuth(BASE_URL, client, SAMPLE_PROMPT, isAdmin)
  response.assertBodyContains({ message: ExceptionContract.SucessfullyCreated, data: serializate(SAMPLE_PROMPT) })
  response.assertStatus(HTTP.CREATED)
}

async function testNonAdminAuthorized(client: ApiClient) {
  return await testAdminAuthorized(client, false)
}

export default testPromptStore