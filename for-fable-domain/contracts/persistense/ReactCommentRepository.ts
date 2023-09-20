import { CommentEntity, CommentReactionEntity, CommentReactionInsert, UserEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    userId: UserEntity['id']
}

export interface ReactCommentRepository
  extends DefaultRepository<CommentReactionInsert, CommentReactionEntity> {
    getBruteReactions(commentId: CommentEntity['id']): Promise<CommentReactionEntity[]>
    getCertainReaction(userId: UserEntity['id'], commentId: CommentEntity['id']): Promise<CommentReactionEntity|null>
    create(body: CommentReactionInsert & ExtraInfoOnCreate): Promise<CommentReactionEntity>
}
