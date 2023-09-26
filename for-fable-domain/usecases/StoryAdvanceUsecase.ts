
export type StoreAdvanceResponse = { toContinueLoop: boolean }

export interface StoryAdvanceUsecase {
  tryMakeStoreAdvance(promptId: number): Promise<StoreAdvanceResponse>
}
