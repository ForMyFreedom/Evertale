
import { PromptEntity, WriteEntity, CommentEntity, calculatePointsThrowReactions } from "../entities"

export type ProposalInsert = {
  text: string
} & Pick<ProposalEntity, 'promptId'>


export abstract class ProposalEntity {
  id: number
  writeId: WriteEntity['id']
  promptId: PromptEntity['id']
  orderInHistory: number
  definitive: boolean
  popularity: number // Good Reactions - Bad Reactions

  abstract getWrite(): Promise<WriteEntity>
  abstract getPrompt(): Promise<PromptEntity>
  abstract getComment(): Promise<CommentEntity[]>
  abstract calculateProposalPopularity(proposal: ProposalEntity): Promise<void>

  static async calculateProposalPopularity(proposal: ProposalEntity): Promise<void> {
    proposal.popularity = calculatePointsThrowReactions(
      (await (await proposal.getWrite()).getReactions())
    )  
  }
}
