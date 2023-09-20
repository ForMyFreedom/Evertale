import { DateTime } from 'luxon'
import { UserEntity } from './User'
import { CommentEntity } from './Comment'
import { WriteEntity } from './Write'
import { ConstantEntity } from './Constant'
import { InteractionEntity } from './_Base'
import { PromptEntity } from './Prompt'

export enum ReactionType {
  'POSITIVE',
  'NEGATIVE',
  'CONCLUSIVE',
  'COMPLAINT',
  'POSITIVE_CONCLUSIVE',
}

export abstract class ReactionEntity {
  id: number
  userId: UserEntity['id']
  type: ReactionType
  createdAt: DateTime
  updatedAt: DateTime

  abstract getTargetId(): number
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
      (await reaction.getOwner()).interactionBanned()
      await target.delete()
      console.log(`The Comment ${(await reaction.getOwner()).id} was banned!`)
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

  getTargetId(): number { return this.commentId }
}

export abstract class WriteReactionEntity extends ReactionEntity {
  writeId: WriteEntity['id']

  abstract getWrite(): Promise<WriteEntity>

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
    allReactions.filter(r => Number(ReactionType[r.type]) === ReactionType.COMPLAINT).length
  ) - (
    allReactions.filter(r => reactionPositive(Number(r.type))).length
  )
}

export function getNumericValueOfReaction(type: ReactionType): number {
  const typeToNumber: {[key in ReactionType]: number} = {
    0: 1,   // POSITIVE
    1: -1,  // NEGATIVE
    2: 1,   // CONCLUSIVE
    3: -2,  // COMPLAINT
    4: 2,   // POSITIVE_CONCLUSIVE
  }

  return typeToNumber[ReactionType[type]]
}

export async function getScoreImpactOfReaction(type: ReactionType, { strengthOfPositiveOpinion, strengthOfNegativeOpinion }: ConstantEntity): Promise<number> {
  const strengthByType: {[key in ReactionType]: number} = {
    0: strengthOfPositiveOpinion,    // POSITIVE
    1: 0,                            // NEGATIVE
    2: 0,                            // CONCLUSIVE
    3: -strengthOfNegativeOpinion,   // COMPLAINT
    4: strengthOfPositiveOpinion     // POSITIVE_CONCLUSIVE
  }

  return strengthByType[type]
}

