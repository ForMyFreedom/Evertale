import { ApiClient } from '@japa/api-client/build/src/client'
import { ProposalValidatorSchema } from 'App/Validators/ProposalValidator'
import { ConnectionType, postWithAuth } from '../_utils/basic-auth-requests'
import Proposal from 'App/Models/Proposal'
import { postPrompt } from '../3-prompts/_data'
import { reverseSerializate } from '../_utils/serializer'

export const BASE_URL = '/api/proposal'

export const SAMPLE_PROPOSAL: typeof ProposalValidatorSchema.props = {
	text: ' some text',
	promptId: 1,
}

export const EDIT_SAMPLE_PROPOSAL: Partial<typeof ProposalValidatorSchema.props> = {
	text: "Opa"
}

export const WRONG_SAMPLE_PROPOSAL = {
	title: 'hello'
}

export const postProposal = async (client: ApiClient, connectionType: ConnectionType = ConnectionType.Admin) => {
  await postPrompt(client)
  const toUseResponse = await postWithAuth(BASE_URL, client, connectionType, SAMPLE_PROPOSAL)
  return reverseSerializate(toUseResponse.body().data) as Proposal
}
