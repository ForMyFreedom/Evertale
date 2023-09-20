import { UserEntity, WriteEntity, WriteReactionEntity, WriteReactionInsert } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    userId: UserEntity['id']
}

export interface ReactWriteRepository extends DefaultRepository<WriteReactionInsert, WriteReactionEntity> {
    create(body: WriteReactionInsert & ExtraInfoOnCreate): Promise<WriteReactionEntity>
    getBruteReactions(writeId: WriteEntity['id']): Promise<WriteReactionEntity[]>
    getCertainReaction(userId: UserEntity['id'], writeId: WriteEntity['id']): Promise<WriteReactionEntity|null>
}
