import { DateTime } from 'luxon'
import { WriteReactionEntity } from './Reaction'
import { UserEntity } from './User'
import { InteractionEntity } from './_Base'

export type WriteInsert = Pick<WriteEntity, 'text'|'authorId'>

export abstract class WriteEntity implements InteractionEntity {
  id: number
  text: string
  edited: boolean
  authorId: number | null
  createdAt: DateTime
  updatedAt: DateTime

  abstract getAuthor(): Promise<UserEntity>
  abstract getReactions(): Promise<WriteReactionEntity[]>
  abstract delete(): Promise<void>
}
