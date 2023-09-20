import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../entities"


export interface CommentsUsecase {
  indexByWrite(writeId: WriteEntity['id']): Promise<void>
  store(body: CommentInsert): Promise<void>
  update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<void>
  destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<void>
}
