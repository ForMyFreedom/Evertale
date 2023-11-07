import { Pagination, WriteEntity, WriteInsert, WriteRepository } from "@ioc:forfabledomain";
import Write from "App/Models/Write";
import { paginate } from "./utils";

export class WritePersistence implements WriteRepository {
    public static instance = new WritePersistence()

    async find(writeId: WriteEntity['id']): Promise<Write|null> {
        return Write.find(writeId)
    }

    async findAll(page?: number, limit?: number): Promise<Pagination<WriteEntity>['data']> {
        return paginate(await Write.query().paginate(page || 1, limit))
    }

    async create(body: WriteInsert): Promise<WriteEntity> {
        return await Write.create(body)
    }

    async delete(entityId: number): Promise<WriteEntity | null> {
        const write = await Write.find(entityId)
        if (write) {
            await write.delete()
            return write
        } else {
            return null
        }
    }

    async update(entityId: number, partialBody: Partial<WriteEntity>): Promise<WriteEntity | null> {
        const write = await Write.find(entityId)
        if (write) {
            write.merge(partialBody)
            await write.save()
            return write
        } else {
            return null
        }
    }
}
