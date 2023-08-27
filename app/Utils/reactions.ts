import { CommentReaction, ReactionType, WriteReaction } from "App/Models/Reaction"

export function cleanReactions(reactions: CommentReaction[]|WriteReaction[]): any[] {
  let cleanReactions = reactions.map((value: CommentReaction|WriteReaction) => {
    return { type: ReactionType[value.type] as unknown as ReactionType, amount: value.id }
  })

  let positiveConclusive = cleanReactions.find((value)=>value.type === ReactionType.POSITIVE_CONCLUSIVE)?.amount || 0

  cleanReactions = cleanReactions.filter((value)=> value.type !== ReactionType.POSITIVE_CONCLUSIVE)

  const positive = cleanReactions.find((value)=>value.type === ReactionType.POSITIVE)
  if (positive) {
    positive.amount+=positiveConclusive
  } else {
    cleanReactions.push({type: ReactionType.POSITIVE, amount: positiveConclusive})
  }

  const conclusive = cleanReactions.find((value)=>value.type === ReactionType.CONCLUSIVE)
  if (conclusive) {
    conclusive.amount+=positiveConclusive
  } else {
    cleanReactions.push({type: ReactionType.CONCLUSIVE, amount: positiveConclusive})
  }

  cleanReactions = cleanReactions.filter((value)=> value.amount > 0)
  return cleanReactions.map((value) => {return {...value, type: ReactionType[value.type]}})
}

export function reactionIsConclusive(type: ReactionType): boolean {
  return type === ReactionType.CONCLUSIVE || type === ReactionType.POSITIVE_CONCLUSIVE
}


export function calculatePointsThrowReactions(reactionsArray: WriteReaction[]|CommentReaction[]) {
  let points = 0
  for (const reaction of reactionsArray) {
    points += getNumericOfReactionType(reaction.type)
  }
  return points
}

export function getNumericOfReactionType(type: ReactionType): number {
  const typeToNumber: {[key in ReactionType]: number} = {
    0: 1,   // POSITIVE
    1: -1,  // NEGATIVE
    2: 1,   // CONCLUSIVE
    3: -2,  // COMPLAINT
    4: 2,   // POSITIVE_CONCLUSIVE
  }

  return typeToNumber[ReactionType[type]]
}