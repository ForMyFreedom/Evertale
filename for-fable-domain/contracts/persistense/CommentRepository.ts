import { CommentEntity, CommentInsert, UserEntity, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    authorId: UserEntity['id']
}

export interface CommentRepository extends DefaultRepository<CommentInsert, CommentEntity> {
    getByWrite(writeId: WriteEntity['id']): Promise<CommentEntity[]>
    loadAuthors(commentArray: CommentEntity[]): Promise<UserEntity[]>
    create(body: CommentInsert & ExtraInfoOnCreate): Promise<CommentEntity>
}
