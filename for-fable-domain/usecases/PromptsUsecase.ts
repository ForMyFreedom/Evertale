import { GainControlOverDailyPromptInsert, PromptEntity, PromptInsert, UserEntity } from '../entities'

export interface PromptsUsecase {
  index(): Promise<void>
  show(promptId: PromptEntity['id']): Promise<void>
  store(authorId: UserEntity['id']|undefined, body: PromptInsert): Promise<void>
  update(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<void>
  destroy(userId: UserEntity['id']|undefined, promptId: PromptEntity['id']): Promise<void>
  appropriateDailyPrompt(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<void>
}
