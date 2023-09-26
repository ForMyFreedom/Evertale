import { CommentValidatorSchema } from 'App/Validators/CommentValidator'
import { postWithAuth } from '../_utils/basic-auth-requests'
import { ApiClient } from '@japa/api-client/build/src/client'
import Comment from 'App/Models/Comment'
import { postPrompt } from '../3-prompts/_data'

export const BASE_URL = '/api/comment'

export const SAMPLE_COMMENT: typeof CommentValidatorSchema.props = {
  writeId: 1,
  answerToId: null,
  text: 'Some comment',
  imageUrl: 'https://cdn-icons-png.flaticon.com/512/3773/3773795.png',
}

export const SAMPLE_COMMENT_ANSWER: typeof CommentValidatorSchema.props = {
  writeId: 1,
  answerToId: 1,
  text: 'Some answer',
  imageUrl: null,
}

export const EDIT_SAMPLE_COMMENT: Partial<typeof CommentValidatorSchema.props> = {
  text: 'New text'
}

export const WRONG_SAMPLE_COMMENT = {
  text: 0
}

export const postComment = async (client: ApiClient, isAdmin: boolean = true) => {
  await postPrompt(client)
  const response = await postWithAuth(BASE_URL, client, isAdmin, SAMPLE_COMMENT)
  return response.body().data as Comment
}