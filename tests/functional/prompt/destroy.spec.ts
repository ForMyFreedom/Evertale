import { TestContext } from '@japa/runner'
import { deleteWithAuth, postWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, ExceptionContract, SAMPLE_PROMPT } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import Prompt from 'App/Models/Prompt'

async function testPromptDestroy({ client }: TestContext): Promise<void> {
  const toUseResponse = await postWithAuth(BASE_URL, client, SAMPLE_PROMPT)
  const prompt = toUseResponse.body().data as Prompt

  await testBasicUnauthenticated(client, prompt.id)
  await testBasicUndefinedId(client)
  await testBlockWithoutAuthorship(client, prompt.id)
  await testBasicAccepted(client, prompt.id)
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

async function testBlockWithoutAuthorship(client: ApiClient, id: number): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantDeleteOthersWrite})
}

async function testBasicAccepted(client: ApiClient, id: number): Promise<void> {
  let response = await deleteWithAuth(`${BASE_URL}/${id}`, client)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyDestroyed})
}

export default testPromptDestroy