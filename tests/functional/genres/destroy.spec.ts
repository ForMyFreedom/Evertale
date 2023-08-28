import { TestContext } from '@japa/runner'
import { deleteWithAuth, postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, SAMPLE_GENRE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import Genre from 'App/Models/Genre'

async function testGenreDestroy({ client }: TestContext): Promise<void> {
  const toDestroyResponse = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  const genre = toDestroyResponse.body().data as Genre

  await testBasicUnauthenticated(client, genre.id)
  await testBasicUndefinedId(client)
  await testBasicUnauthorized(client, genre.id)
  await testBasicAccepted(client, genre.id)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.delete(`${BASE_URL}/${id}`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/99`, client)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBasicAccepted(client: ApiClient, id: number): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyDestroyed})
}

async function testBasicUnauthorized(client: ApiClient, id: number): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({ error: ExceptionContract.Unauthorized })
}

export default testGenreDestroy