import { WriteEntity, WriteInsert, WriteRepository } from "@ioc:forfabledomain";
import Write from "App/Models/Write";

export class WritePersistence implements WriteRepository {
    public static instance = new WritePersistence()

    async find(writeId: WriteEntity['id']): Promise<Write|null> {
        return Write.find(writeId)
    }

    async findAll(): Promise<WriteEntity[]> {
        return Write.all()
    }

    async create(body: WriteInsert): Promise<WriteEntity> {
        return Write.create(body)
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
