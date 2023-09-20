import { ProposalEntity, PromptEntity, UserEntity, ProposalInsert } from "../entities"

export interface ProposalsUsecase {
  indexByPrompt(promptId: PromptEntity['id']): Promise<void>
  actualIndexByPrompt(promptId: PromptEntity['id']): Promise<void>
  show(proposalId: ProposalEntity['id']): Promise<void>
  store(userId: UserEntity['id']|undefined, body: ProposalInsert ): Promise<void>
  update(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id'], partialBody: Partial<ProposalInsert>): Promise<void>
  destroy(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id']): Promise<void>
}
