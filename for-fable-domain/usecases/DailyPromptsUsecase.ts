
export interface DailyPromptsUsecase {
  refreshDailyPrompt(): Promise<void>
  deleteAllNonAppropriatedDailyPrompts(): Promise<void>
  createDailyPromptsForEachGenre(): Promise<void>
}