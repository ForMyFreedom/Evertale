import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

export interface CommentRepository extends DefaultRepository<CommentInsert, CommentEntity> {
    getByWrite(writeId: WriteEntity['id']): Promise<CommentEntity[]>
    loadAuthors(commentArray: CommentEntity[]): Promise<UserEntity[]>
}
