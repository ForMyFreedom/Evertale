import { ReactionEntity, ReactionType } from "../Reaction"

export type ExibitionReaction = {type: ReactionType, amount: number}

export function getExibitionReaction(reactions: ReactionEntity[]): ExibitionReaction[] {
  let cleanReactions: ExibitionReaction[] = getBruteExitionReactionList(reactions)
  let positiveConclusive: number = getPositiveConclusiveReactionAmount(cleanReactions)

  cleanReactions = removeAllPositiveConclusive(cleanReactions)
  cleanReactions = solvePositiveAggregate(positiveConclusive, cleanReactions)
  cleanReactions = solveConclusiveAggregate(positiveConclusive, cleanReactions)
  cleanReactions = cleanBlankReactions(cleanReactions)

  return cleanReactions
}

function getBruteExitionReactionList(reactions: ReactionEntity[]): ExibitionReaction[] {
  return reactions.map((value: ReactionEntity) => {
    return { type: value.type, amount: value.id }
  })
}

function getPositiveConclusiveReactionAmount(reactions: ExibitionReaction[]): number {
  return reactions.find((value)=>value.type === ReactionType.POSITIVE_CONCLUSIVE)?.amount || 0
}

function removeAllPositiveConclusive(reactions: ExibitionReaction[]): ExibitionReaction[] {
  return reactions.filter((value)=> value.type !== ReactionType.POSITIVE_CONCLUSIVE)
}


function solvePositiveAggregate(positiveConclusive: number, reactions: ExibitionReaction[]): ExibitionReaction[] {
  const positive = findPositive(reactions)
  if (positive) {
    positive.amount += positiveConclusive
  } else {
    reactions.push({type: ReactionType.POSITIVE, amount: positiveConclusive})
  }

  return reactions
}


function solveConclusiveAggregate(positiveConclusive: number, reactions: ExibitionReaction[]): ExibitionReaction[] {
  const conclusive = findConclusive(reactions)
  if (conclusive) {
    conclusive.amount+=positiveConclusive
  } else {
    reactions.push({type: ReactionType.CONCLUSIVE, amount: positiveConclusive})
  }

  return reactions
}


function findPositive(cleanReactions: ExibitionReaction[]): ExibitionReaction | undefined {
  return cleanReactions.find((value)=>value.type === ReactionType.POSITIVE)
}


function findConclusive(cleanReactions: ExibitionReaction[]): ExibitionReaction | undefined {
  return cleanReactions.find((value)=>value.type === ReactionType.CONCLUSIVE)
}

function cleanBlankReactions(cleanReactions: ExibitionReaction[]): ExibitionReaction[] {
  return cleanReactions.filter((value)=> value.amount > 0)
}
