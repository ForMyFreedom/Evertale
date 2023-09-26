import { CommentReactionEntity, CommentReactionInsert, ReactCommentRepository } from "@ioc:forfabledomain";
import { CommentReaction } from "App/Models/Reaction";


export class ReactCommentPersistence implements ReactCommentRepository {
  public static instance = new ReactCommentPersistence()

  async getBruteReactions(commentId: number): Promise<CommentReactionEntity[]> {
    const bruteReactions = await CommentReaction.query()
      .where('commentId', '=', commentId)
      .select('type')
      .countDistinct('id as id')
      .count('* as total')
      .groupBy('type')
  
    return bruteReactions
  }

  async getCertainReaction(userId: number, commentId: number): Promise<CommentReactionEntity | null> {
    const couldFind = await CommentReaction.query()
      .where('userId', '=', userId)
      .where('commentId', '=', commentId)
    
    if(couldFind.length > 0){
      return couldFind[0]
    } else {
      return null
    }
  }

  async create(body: CommentReactionInsert & { userId: number; }): Promise<CommentReactionEntity> {
    return CommentReaction.create(body)
  }

  async find(entityId: number): Promise<CommentReactionEntity | null> {
    return CommentReaction.find(entityId)
  }

  async findAll(): Promise<CommentReactionEntity[]> {
    return CommentReaction.all()
  }

  async delete(entityId: number): Promise<CommentReactionEntity | null> {
    const reaction = await CommentReaction.find(entityId)
    if (reaction) {
      await reaction.delete()
      return reaction
    } else {
      return null
    }
  }

  async update(entityId: number, partialBody: Partial<CommentReactionEntity>): Promise<CommentReactionEntity | null> {
    const reaction = await CommentReaction.find(entityId)
    if (reaction) {
      reaction.merge(partialBody)
      await reaction.save()
      return reaction
    } else {
      return null
    }
  }
}
