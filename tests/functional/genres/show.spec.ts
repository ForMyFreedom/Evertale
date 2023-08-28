import { TestContext } from '@japa/runner'
import { getWithAuth, postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, SAMPLE_GENRE } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { serializate } from '../_utils/serializer'
import Genre from 'App/Models/Genre'

async function testGenreShow({ client }: TestContext): Promise<void> {
  const toUseResponse = await postWithAuth(BASE_URL, client, SAMPLE_GENRE)
  const genre = toUseResponse.body().data as Genre

  await testBasicUnauthenticated(client, genre.id)
  await testBasicUndefinedId(client)
  await testAdminAuthorized(client, genre.id)
  await testNonAdminAuthorized(client, genre.id)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.get(`${BASE_URL}/${id}`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testAdminAuthorized(client: ApiClient, id: number, isAdmin: boolean = true): Promise<void> {
  let response = await getWithAuth(`${BASE_URL}/${id}`, client, isAdmin)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains(
    { message: ExceptionContract.SucessfullyRecovered, data: serializate(SAMPLE_GENRE) }
  )
}

async function testNonAdminAuthorized(client: ApiClient, id: number): Promise<void> {
  return await testAdminAuthorized(client, id, false)
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await getWithAuth(`${BASE_URL}/99`, client)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

export default testGenreShow