import { TestContext } from '@japa/runner'
import { postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { ApiResponse } from '@japa/api-client/build/src/response'
import { BASE_URL, ExceptionContract, SAMPLE_GENRE, WORDS_SAMPLE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import Genre from 'App/Models/Genre'

async function testGenreInsertWords({ client }: TestContext): Promise<void> {
  const toUseResponse = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  const genre = toUseResponse.body().data as Genre

  await testBasicUnauthenticated(client, genre.id)
  await testBasicUnauthorized(client, genre.id)
  await testBasicUnacceptedBody(client, genre.id)
  await testBasicUndefinedId(client)
  await testBasicAccepted(client, genre.id)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.post(`${BASE_URL}/${id}/word`).json(WORDS_SAMPLE)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUnauthorized(client: ApiClient, id: number): Promise<void> {
  let response = await postWithAuth(`${BASE_URL}/${id}/word`, client, WORDS_SAMPLE, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

async function testBasicUnacceptedBody(client: ApiClient, id: number): Promise<void> {
  let response: ApiResponse
  response = await postWithAuth(`${BASE_URL}/${id}/word`, client, {})
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({error: ExceptionContract.BodyValidationFailure})

  response = await postWithAuth(`${BASE_URL}/${id}/word`, client, {words: [1,2,3]})
  response.assertStatus(HTTP.BAD_REQUEST)
  response.assertBodyContains({error: ExceptionContract.BodyValidationFailure})
}

async function testBasicAccepted(client: ApiClient, id: number): Promise<void> {
  let response = await postWithAuth(`${BASE_URL}/${id}/word`, client, WORDS_SAMPLE)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({ message: ExceptionContract.SucessfullyUpdated })
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await postWithAuth(`${BASE_URL}/99/word`, client, WORDS_SAMPLE)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

export default testGenreInsertWords