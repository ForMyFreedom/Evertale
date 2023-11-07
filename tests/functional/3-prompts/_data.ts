import { ApiClient } from '@japa/api-client/build/src/client'
import { PromptValidatorSchema } from 'App/Validators/PromptValidator'
import { postGenre } from '../2-genres/_data'
import { ConnectionType, postWithAuth } from '../_utils/basic-auth-requests'
import Prompt from 'App/Models/Prompt'
import { reverseSerializate } from '../_utils/serializer'

export const BASE_URL = '/api/prompt'

export const SAMPLE_PROMPT: typeof PromptValidatorSchema.props = {
	title: "O aaaa",
	text: "Bom dia",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	timeForAvanceInMinutes: 2
}

export const EDIT_SAMPLE_PROMPT: Partial<typeof PromptValidatorSchema.props> = {
	text: "Opa"
}

export const WRONG_SAMPLE_PROMPT = {
	title: "O aaaa",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	concluded: undefined
}

export const postPrompt = async (client: ApiClient, connectionType: ConnectionType = ConnectionType.Admin) => {
  await postGenre(client)
  const toUseResponse = await postWithAuth(BASE_URL, client, connectionType, SAMPLE_PROMPT)
  return reverseSerializate(toUseResponse.body().data) as Prompt
}
