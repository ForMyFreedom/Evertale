import { WriteReactionValidatorSchema } from 'App/Validators/WriteReactionValidator'
import { postWithAuth } from '../_utils/basic-auth-requests'
import { ApiClient } from '@japa/api-client/build/src/client'
import { WriteReaction } from 'App/Models/Reaction'
import { postPrompt } from '../3-prompts/_data'
import { postProposal } from '../4-proposals/_data'
import { ReactionType } from '@ioc:forfabledomain'

export const BASE_URL = '/api/react-write'

export const SAMPLE_REACT_WRITE: typeof WriteReactionValidatorSchema.props = {
  writeId: 1,
  type: ReactionType.NEGATIVE,
}

export const OTHER_SAMPLE_REACT_WRITE: typeof WriteReactionValidatorSchema.props = {
  writeId: 1,
  type: ReactionType.POSITIVE,
}

export const CONCLUSIVE_REACT_WRITE: typeof WriteReactionValidatorSchema.props = {
  writeId: 1,
  type: ReactionType.CONCLUSIVE,
}

export const WRONG_SAMPLE_REACT_WRITE = {
  type: 'CONFUSED'
}

export const postReactWrite = async (client: ApiClient, isAdmin: boolean = true, isOnPrompt: boolean = true) => {
  let id: number

  if (isOnPrompt) {
    const prompt = await postPrompt(client, !isAdmin)
    id = prompt.writeId
  } else {
    const proposal = await postProposal(client, !isAdmin)
    id = proposal.writeId
  }

  SAMPLE_REACT_WRITE.writeId = id

  const response = await postWithAuth(BASE_URL, client, isAdmin, SAMPLE_REACT_WRITE)
  return response.body().data as WriteReaction
}