import { DateTime } from 'luxon'
import { WriteEntity } from './Write'
import { UserEntity } from './User'
import { CommentReactionEntity } from './Reaction'
import { InteractionEntity } from './_Base'

export type CommentInsert = Pick<CommentEntity, 
  'writeId'|'answerToId'|'text'|'imageUrl'
>

export abstract class CommentEntity implements InteractionEntity {
  id: number
  writeId: WriteEntity['id']
  authorId: UserEntity['id']
  answerToId: CommentEntity['id'] | null
  imageUrl: string | null
  text: string
  edited: boolean
  createdAt: DateTime
  updatedAt: DateTime

  abstract getWrite(): Promise<WriteEntity>
  abstract getReactions(): Promise<CommentReactionEntity[]>
  abstract getAnswers(): Promise<CommentEntity[]>
  abstract getAuthor(): Promise<UserEntity>
  abstract delete(): Promise<void>
}
