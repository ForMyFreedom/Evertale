import { DateTime } from 'luxon'
import { BelongsTo, afterCreate, beforeDelete, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Write from './Write'
import Constant from './Constant'
import Prompt from './Prompt'
import Proposal from './Proposal'
import { InteractionEntity, CommentEntity, UserEntity, WriteEntity, ReactionType, CommentReactionEntity, WriteReactionEntity, ReactionEntity } from '@ioc:forfabledomain'
import { BaseAdonisModel } from './_Base'

export class CommentReaction extends BaseAdonisModel implements CommentReactionEntity {
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
    await reaction.comment.getAuthor()
    await reaction.comment.getAuthor()
    ReactionEntity.removeScoreAlterationInTarget(reaction, reaction.comment.author, config)
    await reaction.comment.author.save()
  }

  async addScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('comment')
    await reaction.comment.getAuthor()
    await reaction.comment.getAuthor()
    ReactionEntity.addScoreAlterationInTarget(reaction, reaction.comment.author, config)
    await reaction.comment.author.save()
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
    const toBan = await ReactionEntity.verifyInteractionBan(
      reaction.comment.reactions,
      await getStoryFromWrite(reaction.comment.write),
      config
    )
    if(toBan){
      await reaction.comment.getAuthor()
      await reaction.comment.getAuthor()
      UserEntity.interactionBanned(reaction.comment.author, config);
      await reaction.comment.delete()
    }
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

export class WriteReaction extends BaseAdonisModel implements WriteReactionEntity {
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
    await reaction.write.getAuthor()
    await reaction.write.getAuthor()
    ReactionEntity.removeScoreAlterationInTarget(reaction, reaction.write.author, config)
    await reaction.write.author.save()
  }

  async addScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    const config = await Constant.firstOrFail()
    await reaction.load('write')
    await reaction.write.getAuthor()
    await reaction.write.getAuthor()
    ReactionEntity.addScoreAlterationInTarget(reaction, reaction.write.author, config)
    await reaction.write.author.save()
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

    const toBan = await ReactionEntity.verifyInteractionBan(
      reaction.write.reactions,
      await getStoryFromWrite(reaction.write),
      config
    )
    if(toBan){
      await reaction.write.getAuthor()
      await reaction.write.getAuthor()
      UserEntity.interactionBanned(reaction.write.author, config);
      await reaction.write.delete()
    }
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