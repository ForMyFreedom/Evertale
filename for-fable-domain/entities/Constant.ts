
export type ConstantInsert = ConstantEntity

export abstract class ConstantEntity {
  strengthOfPositiveOpinion: number // For every positive reaction, it will gain this in the User Score
  strengthOfNegativeOpinion: number // For each complaint, it will lose this in the User Score
  deleteStrength: number            // For every automatically deleted comment, it will lose that in the User Score [Probably remove]
  completionPercentage: number      // When multiplied with the popularity of the story, if a proposal has more conclusive reactions than that, the story ends with it
  exclusionPercentage:number        // When multiplied with the popularity of the story, if a comment/proposal has more complaints than that, the comment/proposal will be deleted [What about the prompt case, is genre popularity used]
  banLimit: number                  // When a User Score reaches this negative value, the User will be automatically excluded from the system
}
