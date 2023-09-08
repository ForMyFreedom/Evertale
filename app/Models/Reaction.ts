import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, beforeDelete, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Comment from './Comment'
import Write from './Write'
import Constant from './Constant'
import { reactionPositive } from 'App/Utils/reactions'
import Prompt from './Prompt'
import Proposal from './Proposal'

export enum ReactionType {
  'POSITIVE',
  'NEGATIVE',
  'CONCLUSIVE',
  'COMPLAINT',
  'POSITIVE_CONCLUSIVE',
}

const TYPE_SERIAL = {
  consume: (value) => {
    return ReactionType[value]
  },
  serialize: (value) => {
    return ReactionType[value]
  },
}

export class CommentReaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public commentId: number

  @column(TYPE_SERIAL)
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  public comment: BelongsTo<typeof Comment>

  @beforeDelete()
  static async removeScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    await reaction.load('comment')
    await reaction.comment.load('author')
    reaction.comment.author.score -= await getStrengthByType(reaction.type)
    await reaction.comment.author.save()
    await reaction.comment.author.verifyBan()
  }

  @afterCreate()
  static async addScoreAlterationInTarget(reaction: CommentReaction): Promise<void> {
    await reaction.load('comment')
    await reaction.comment.load('author')
    reaction.comment.author.score += await getStrengthByType(reaction.type)
    await reaction.comment.author.save()
    await reaction.comment.author.verifyBan()
  }

  @afterCreate()
  static async verifyInteractionBan(reaction: CommentReaction): Promise<void> {
    const { exclusionPercentage } = await Constant.firstOrFail()
    await reaction.load('comment')
    await reaction.comment.load('reactions')
    await reaction.comment.load('write')
    const diff = getComplainVsPositive(reaction.comment.reactions)
    const exclusionLimiar = 1 + (await getStoryFromWrite(reaction.comment.write)).popularity * exclusionPercentage
    if (diff > exclusionLimiar) {
      console.log(`The Comment ${reaction.comment.id} was banned!`)
      await reaction.comment.load('author')
      await reaction.comment.author.interactionBanned()
      await reaction.comment.delete()
    }
  }
}

export class WriteReaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public writeId: number

  @column(TYPE_SERIAL)
  public type: ReactionType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>
  
  @beforeDelete()
  static async removeScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    await reaction.load('write')
    await reaction.write.load('author')
    reaction.write.author.score -= await getStrengthByType(reaction.type)
    await reaction.write.author.save()
    await reaction.write.author.verifyBan()
  }

  @afterCreate()
  static async addScoreAlterationInTarget(reaction: WriteReaction): Promise<void> {
    await reaction.load('write')
    await reaction.write.load('author')
    reaction.write.author.score += await getStrengthByType(reaction.type)
    await reaction.write.author.save()
    await reaction.write.author.verifyBan()
  }

  @afterCreate()
  static async verifyInteractionBan(reaction: WriteReaction): Promise<void> {
    const { exclusionPercentage } = await Constant.firstOrFail()
    await reaction.load('write')
    await reaction.write.load('reactions')
    const diff = getComplainVsPositive(reaction.write.reactions)
    const exclusionLimiar = (await getStoryFromWrite(reaction.write)).popularity * exclusionPercentage
    if (diff > 1 + exclusionLimiar) {
      console.log(`The Write ${reaction.write.id} was banned!`)
      await reaction.write.load('author')
      await reaction.write.author.interactionBanned()
      await reaction.write.delete()
    }
  }
}


async function getStrengthByType(type: ReactionType): Promise<number> {
  const { strengthOfPositiveOpinion, strengthOfNegativeOpinion } = await Constant.firstOrFail()

  const strengthByType: {[key in ReactionType]: number} = {
    0: strengthOfPositiveOpinion,    // 'POSITIVE'
    1: 0,                            // 'NEGATIVE'
    2: 0,                            // 'CONCLUSIVE'
    3: -strengthOfNegativeOpinion,   // 'COMPLAINT'
    4: strengthOfPositiveOpinion     // 'POSITIVE_CONCLUSIVE'
  }

  return strengthByType[type]
}

function getComplainVsPositive(allReactions: (WriteReaction|CommentReaction)[]): number {
  return (
    allReactions.filter(r  =>  Number(ReactionType[r.type]) === ReactionType.COMPLAINT).length
  ) - (
    allReactions.filter(r => reactionPositive(Number(r.type))).length
  )
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