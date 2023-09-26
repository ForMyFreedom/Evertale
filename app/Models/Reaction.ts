import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, beforeDelete, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Write from './Write'
import Constant from './Constant'
import Prompt from './Prompt'
import Proposal from './Proposal'
import { InteractionEntity, CommentReactionEntity, WriteReactionEntity, CommentEntity, UserEntity, WriteEntity, ReactionType, ReactionEntity } from '@ioc:forfabledomain'

export class CommentReaction extends BaseModel implements CommentReactionEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public commentId: number

  @column()
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  public comment: BelongsTo<typeof Comment>

  async removeScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('comment')
    await reaction.comment.load('author')
    ReactionEntity.removeScoreAlterationInTarget<Comment>(reaction, reaction.comment, config)
    await reaction.comment.author.save()
  }

  async addScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('comment')
    await reaction.comment.load('author')
    ReactionEntity.addScoreAlterationInTarget(reaction, reaction.comment, config)
    await (await reaction.comment.getAuthor()).save()
  }

  @beforeDelete()
  static async removeScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    reaction.removeScoreAlterationInTarget(reaction)
  }

  @afterCreate()
  static async addScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    reaction.addScoreAlterationInTarget(reaction)
  }

  @afterCreate()
  static async verifyInteractionBan(reaction: CommentReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('comment')
    await reaction.comment.load('reactions')
    await reaction.comment.load('write')
    await ReactionEntity.verifyInteractionBan(
      reaction,
      reaction.comment,
      await getStoryFromWrite(reaction.comment.write),
      config
    )
  }

  public async getComment(this: CommentReaction): Promise<CommentEntity> {
    await this.load('comment')
    return this.comment
  }

  public async getOwner(this: CommentReaction): Promise<UserEntity> {
    await this.load('owner')
    return this.owner
  }

  public getTargetId(): number { return this.commentId }

  public getTarget(): Promise<InteractionEntity> {
    return this.getComment()
  }
}

export class WriteReaction extends BaseModel implements WriteReactionEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public writeId: number

  @column()
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>
  
  async removeScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('write')
    await reaction.write.load('author')
    ReactionEntity.removeScoreAlterationInTarget(reaction, reaction.write, config)
    await reaction.write.author.save()
  }

  async addScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('write')
    await reaction.write.load('author')
    ReactionEntity.addScoreAlterationInTarget(reaction, reaction.write, config)
    await (await reaction.write.getAuthor()).save()
  }

  @beforeDelete()
  static async removeScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    reaction.removeScoreAlterationInTarget(reaction)
  }

  @afterCreate()
  static async addScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    reaction.addScoreAlterationInTarget(reaction)
  }

  @afterCreate()
  static async verifyInteractionBan(reaction: WriteReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('write')
    await reaction.write.load('reactions')
    await ReactionEntity.verifyInteractionBan(
      reaction,
      reaction.write,
      await getStoryFromWrite(reaction.write),
      config
    )
  }

  public async getWrite(this: WriteReaction): Promise<WriteEntity> {
    await this.load('write')
    return this.write
  }
  public async getOwner(this: WriteReaction): Promise<UserEntity> {
    await this.load('owner')
    return this.owner
  }
  public getTargetId(): number { return this.writeId}
  public getTarget(): Promise<InteractionEntity> {
    return this.getWrite()
  }
}


async function getStoryFromWrite(write: Write): Promise<Prompt> {
  const tryFindInPrompt = await Prompt.findBy('writeId', write.id)
  if (tryFindInPrompt) {
    return tryFindInPrompt
  } else {
    const findInProposal = await Proposal.findByOrFail('writeId', write.id)
    await findInProposal.load('prompt')
    return findInProposal.prompt
  }
}