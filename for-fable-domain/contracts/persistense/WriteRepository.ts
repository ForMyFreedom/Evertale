import { WriteInsert, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

export interface WriteRepository extends DefaultRepository<WriteInsert, WriteEntity> {
}
