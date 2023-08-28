import { TestContext } from '@japa/runner'
import { postWithAuth, putWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, EDIT_SAMPLE_GENRE, ExceptionContract, SAMPLE_GENRE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import Genre from 'App/Models/Genre'

async function testGenreUpdate({ client }: TestContext): Promise<void> {
  const toUseResponse = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  const genre = toUseResponse.body().data as Genre

  await testBasicUnauthenticated(client, genre.id)
  await testBasicUnauthorized(client, genre.id)
  await testBasicUndefinedId(client)
  await testBasicAccepted(client, genre.id)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.put(`${BASE_URL}/${id}`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUnauthorized(client: ApiClient, id: number): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/${id}`, client, EDIT_SAMPLE_GENRE, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/99`, client, EDIT_SAMPLE_GENRE)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBasicAccepted(client: ApiClient, id: number): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/${id}`, client, EDIT_SAMPLE_GENRE)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyUpdated})
}

export default testGenreUpdate