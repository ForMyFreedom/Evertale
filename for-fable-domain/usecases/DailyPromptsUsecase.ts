
export interface DailyPromptsUsecase {
  deleteAllNonAppropriatedDailyPrompts(): Promise<void>
  createDailyPromptsForEachGenre(): Promise<void>
}