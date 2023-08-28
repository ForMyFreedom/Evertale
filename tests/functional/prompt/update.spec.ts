import { TestContext } from '@japa/runner'
import { postWithAuth, putWithAuth } from '../_utils/request'
import HTTP from 'http-status-enum'
import { BASE_URL, EDIT_SAMPLE_PROMPT, ExceptionContract, SAMPLE_PROMPT } from './_data'
import { ApiClient } from '@japa/api-client/build/src/client'
import Prompt from 'App/Models/Prompt'

async function testPromptUpdate({ client }: TestContext): Promise<void> {
  const toEditResponse = await postWithAuth(BASE_URL, client, SAMPLE_PROMPT)
  const prompt = toEditResponse.body().data as Prompt

  await testBasicUnauthenticated(client, prompt.id)
  await testBasicUndefinedId(client)
  await testBlockWithoutAuthorship(client, prompt.id)
  await testBasicAccepted(client, prompt.id)
}

async function testBasicUnauthenticated(client: ApiClient, id: number): Promise<void> {
  let response = await client.put(`${BASE_URL}/${id}`)
  response.assertStatus(HTTP.PROXY_AUTHENTICATION_REQUIRED)
  response.assertBody({error: ExceptionContract.Unauthenticated})
}

async function testBasicUndefinedId(client: ApiClient): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/99`, client, EDIT_SAMPLE_PROMPT)
  response.assertStatus(HTTP.NOT_FOUND)
  response.assertBody({error: ExceptionContract.UndefinedId})
}

async function testBlockWithoutAuthorship(client: ApiClient, id: number): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/${id}`, client, EDIT_SAMPLE_PROMPT, false)
  response.assertStatus(HTTP.UNAUTHORIZED)
  response.assertBodyContains({error: ExceptionContract.CantEditOthersWrite})
}

async function testBasicAccepted(client: ApiClient, id: number): Promise<void> {
  let response = await putWithAuth(`${BASE_URL}/${id}`, client, EDIT_SAMPLE_PROMPT)
  response.assertStatus(HTTP.ACCEPTED)
  response.assertBodyContains({message: ExceptionContract.SucessfullyUpdated})
}

export default testPromptUpdate