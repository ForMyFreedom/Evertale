import { ProposalEntity } from "./Proposal"
import { UserEntity } from "./User"
import { WriteEntity } from "./Write"
import  {GenreEntity } from "./Genre"
import { removeDuplicate } from "../utils/arrays"


export type PromptInsert = {
  genreIds: number[]
} & Pick<PromptEntity,
  'title'|'maxSizePerExtension'|
  'limitOfExtensions'|'timeForAvanceInMinutes'
> & Pick<WriteEntity, 'text'>

export type GainControlOverDailyPromptInsert =
  Pick<WriteEntity, 'text'> &
  Pick<PromptEntity, 'title'>

export abstract class PromptEntity {
  id: number
  title: string
  isDaily: boolean
  currentIndex: number
  concluded: boolean
  writeId: WriteEntity['id']
  maxSizePerExtension: number
  limitOfExtensions: number
  timeForAvanceInMinutes: number
  popularity: number             // The amount of Users that had interacted with
  historyText: string            // Not the prompt, but prompt + all proposals in order

  abstract getWrite(): Promise<WriteEntity>
  abstract getGenres(): Promise<GenreEntity[]>
  abstract getProposals(): Promise<ProposalEntity[]>
  abstract calculatePromptPopularity(prompt: PromptEntity, usersThatParticipated: UserEntity[]): Promise<void>
  abstract setHistoryText(prompt: PromptEntity, proposalsInOrder: ProposalEntity[]): Promise<void>

  static async calculatePromptPopularity(prompt: PromptEntity, usersThatParticipated: UserEntity[]): Promise<void> {
    prompt.popularity = removeDuplicate(usersThatParticipated).length
  }

  static async setHistoryText(prompt: PromptEntity, proposalsInOrder: ProposalEntity[]): Promise<void> {
    prompt.historyText = (await prompt.getWrite()).text
    for (const proposal of proposalsInOrder) {
      prompt.historyText += (await proposal.getWrite()).text
    }
  }
}
