import { CommentEntity, CommentReactionEntity, CommentReactionInsert, UserEntity } from "../entities"

export interface ReactCommentsUsecase {
  show(commentId: CommentEntity['id']): Promise<void>
  store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<void>
  destroy(userId: UserEntity['id']|undefined, reactCommentId: CommentReactionEntity['id']): Promise<void>
}
