import { TestContext } from '@japa/runner'
import { getWithAuth, postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, SAMPLE_PROMPT } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import { serializate } from '../_utils/serializer'
import Prompt from 'App/Models/Prompt'

async function testPromptShow({ client }: TestContext): Promise<void> {
  const toUseResponse = await postWithAuth(BASE_URL, client, SAMPLE_PROMPT)
  const prompt = toUseResponse.body().data as Prompt

  await testBasicUnauthenticated(client, prompt.id)
  await testBasicUndefinedId(client)
  await testAdminAuthorized(client, prompt.id)
  await testNonAdminAuthorized(client, prompt.id)
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
    { message: ExceptionContract.SucessfullyRecovered, data: serializate(SAMPLE_PROMPT) }
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

export default testPromptShow