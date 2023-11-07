import { Pagination, ReactWriteRepository, UserEntity, WriteReactionEntity, WriteReactionInsert } from "@ioc:forfabledomain";
import { WriteReaction } from "App/Models/Reaction";
import { paginate } from "./utils";


export class ReactWritePersistence implements ReactWriteRepository {
  public static instance = new ReactWritePersistence()

  async create(body: WriteReactionInsert & { userId: number; }): Promise<WriteReactionEntity> {
    return WriteReaction.create(body)
  }

  async getBruteReactions(writeId: number): Promise<WriteReactionEntity[]> {
    const bruteReactions = await WriteReaction.query()
      .where('writeId', '=', writeId)
      .select('type')
      .countDistinct('id as id')
      .count('* as total')
      .groupBy('type')

    return bruteReactions
  }

  async getCertainReaction(userId: number, writeId: number): Promise<WriteReactionEntity | null> {
    const couldFind = await WriteReaction.query()
      .where('userId', '=', userId)
      .where('writeId', '=', writeId)

    if (couldFind.length > 0){
      return couldFind[0]
    } else {
      return null
    }
  }

  async find(entityId: number): Promise<WriteReactionEntity | null> {
    return WriteReaction.find(entityId)
  }

  async findAll(page?: number, limit?: number): Promise<Pagination<WriteReactionEntity>['data']> {
    return paginate(await WriteReaction.query().paginate(page || 1, limit))
  }

  async delete(entityId: number): Promise<WriteReactionEntity | null> {
    const reaction = await WriteReaction.find(entityId)
    if (reaction) {
      await reaction.delete()
      return reaction
    } else {
      return null
    }
  }

  async update(entityId: number, partialBody: Partial<WriteReactionEntity>): Promise<WriteReactionEntity | null> {
    const reaction = await WriteReaction.find(entityId)
    if (reaction) {
      reaction.merge(partialBody)
      await reaction.save()
      return reaction
    } else {
      return null
    }
  }

  async getAuthor(reaction: WriteReaction): Promise<UserEntity> {
    await reaction.load('owner')
    return reaction.owner
  }
}
