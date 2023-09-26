import { UserEntity, WriteEntity, WriteReactionEntity, WriteReactionInsert } from '../entities'

export interface ReactWritesUsecase {
  show(writeId: WriteEntity['id']): Promise<void>
  store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<void>
  destroy(userId: UserEntity['id']|undefined, reactionId: WriteReactionEntity['id']): Promise<void>
}

