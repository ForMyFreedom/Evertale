import { DateTime } from 'luxon'
import { UserEntity } from './User'
import { CommentEntity } from './Comment'
import { WriteEntity } from './Write'
import { ConstantEntity } from './Constant'
import { InteractionEntity } from './_Base'
import { PromptEntity } from './Prompt'

export enum ReactionType {
  'POSITIVE'='POSITIVE',
  'NEGATIVE'='NEGATIVE',
  'CONCLUSIVE'='CONCLUSIVE',
  'COMPLAINT'='COMPLAINT',
  'POSITIVE_CONCLUSIVE'='POSITIVE_CONCLUSIVE',
}

export abstract class ReactionEntity {
  id: number
  userId: UserEntity['id']
  type: ReactionType
  createdAt: DateTime
  updatedAt: DateTime

  abstract getTargetId(): number
  abstract getTarget(): Promise<InteractionEntity>
  abstract getOwner(): Promise<UserEntity>
  abstract removeScoreAlterationInTarget(reaction: ReactionEntity): Promise<void>
  abstract addScoreAlterationInTarget(reaction: ReactionEntity): Promise<void>

  static async removeScoreAlterationInTarget<T extends InteractionEntity>(reaction: ReactionEntity, target: T, constant: ConstantEntity): Promise<void> {
    const author: UserEntity = await target.getAuthor()
    author.score -= await getScoreImpactOfReaction(reaction.type, constant)
  }

  static async verifyInteractionBan<T extends InteractionEntity>(reaction: ReactionEntity, target: T, story: PromptEntity, { exclusionPercentage }: ConstantEntity): Promise<void> {
    const allReactionsFromOwner = await target.getReactions()
    const diff = getComplainVsPositive(allReactionsFromOwner)
    const exclusionLimiar = 1 + story.popularity * exclusionPercentage
    if (diff > exclusionLimiar) {
      (await(await reaction.getTarget()).getAuthor()).interactionBanned()
      await target.delete()
      console.log(`The Interaction ${(await reaction.getOwner()).id} was banned!`)
    }
  }

  static async addScoreAlterationInTarget<T extends InteractionEntity>(reaction: ReactionEntity, target: T, constant: ConstantEntity): Promise<void> {
    const author: UserEntity = await target.getAuthor()
    author.score += await getScoreImpactOfReaction(reaction.type, constant)
  }
}

export abstract class CommentReactionEntity extends ReactionEntity {
  commentId: CommentEntity['id']

  abstract getComment(): Promise<CommentEntity>

  async getTarget(): Promise<InteractionEntity> {
    return this.getComment()
  }
  getTargetId(): number { return this.commentId }
}

export abstract class WriteReactionEntity extends ReactionEntity {
  writeId: WriteEntity['id']

  abstract getWrite(): Promise<WriteEntity>

  async getTarget(): Promise<InteractionEntity> {
    return this.getWrite()
  }

  getTargetId(): number { return this.writeId }
}

export type CommentReactionInsert = Pick<CommentReactionEntity, 'commentId'|'type'>

export type WriteReactionInsert = Pick<WriteReactionEntity, 'writeId'|'type'>


export function reactionIsConclusive(type: ReactionType): boolean {
  return type === ReactionType.CONCLUSIVE || type === ReactionType.POSITIVE_CONCLUSIVE
}

export function reactionPositive(type: ReactionType): boolean {
  return type === ReactionType.POSITIVE || type === ReactionType.POSITIVE_CONCLUSIVE
}


export function calculatePointsThrowReactions(reactionsArray: ReactionEntity[]): number {
  let points = 0
  for (const reaction of reactionsArray) {
    points += getNumericValueOfReaction(reaction.type)
  }
  return points
}

export function getComplainVsPositive(allReactions: ReactionEntity[]): number {
  return (
    allReactions.filter(r => r.type === ReactionType.COMPLAINT).length
  ) - (
    allReactions.filter(r => reactionPositive(r.type)).length
  )
}

export function getNumericValueOfReaction(type: ReactionType): number {
  const typeToNumber: {[key in ReactionType]: number} = {
    'POSITIVE': 1,
    'NEGATIVE': -1,
    'CONCLUSIVE': 1,
    'COMPLAINT': -2,
    'POSITIVE_CONCLUSIVE': 2,
  }

  return typeToNumber[ReactionType[type]]
}

export async function getScoreImpactOfReaction(type: ReactionType, { strengthOfPositiveOpinion, strengthOfNegativeOpinion }: ConstantEntity): Promise<number> {
  const strengthByType: {[key in ReactionType]: number} = {
    'POSITIVE': strengthOfPositiveOpinion,
    'NEGATIVE': 0,
    'CONCLUSIVE': 0,
    'COMPLAINT': -strengthOfNegativeOpinion,
    'POSITIVE_CONCLUSIVE': strengthOfPositiveOpinion
  }

  return strengthByType[type]
}

