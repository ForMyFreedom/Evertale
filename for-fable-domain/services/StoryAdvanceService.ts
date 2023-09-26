import { PromptEntity, ProposalEntity } from '../entities'
import { ConstantsRepository, PromptRepository, ProposalRepository } from '../contracts'
import { StoreAdvanceResponse, StoryAdvanceUsecase } from '../usecases'
import { DateTime } from 'luxon'

const CONTINUE: StoreAdvanceResponse = { toContinueLoop: true }
const NOT_CONTINUE: StoreAdvanceResponse = { toContinueLoop: false }


export class StoryAdvanceService implements StoryAdvanceUsecase {
  constructor(
    private readonly promptRepository: PromptRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly constantRepository: ConstantsRepository,
  ) { }

  
  async tryMakeStoreAdvance(promptId: number): Promise<StoreAdvanceResponse> {
    console.log(`${DateTime.now()}  |  Try Advance History ${promptId}`)

    const prompt = await this.promptRepository.find(promptId)
    if (!prompt || prompt.concluded) { return NOT_CONTINUE }

    const proposals = await prompt.getProposals()
    if (no(proposals)) { return CONTINUE }

    const currentProposals = proposals.filter(proposal => proposal.orderInHistory === prompt.currentIndex)
    if (no(currentProposals)) { return CONTINUE }

    currentProposals.sort((a, b) => b.popularity - a.popularity)
    const chosenProposal = currentProposals[0]
    if (chosenProposal.popularity <= 0) { return CONTINUE }

    chosenProposal.definitive = true
    prompt.currentIndex += 1

    await this.promptRepository.update(prompt.id, prompt)
    await this.proposalRepository.update(chosenProposal.id, chosenProposal)

    console.log(`The History ${promptId} advanced with the Proposal ${chosenProposal.id}!`)

    if (! await this.storyWasConcluded(prompt, chosenProposal)) {
      return CONTINUE
    } else {
      prompt.concluded = true
      await this.promptRepository.update(prompt.id, prompt)
      return NOT_CONTINUE
    }
  }


  async storyWasConcluded(prompt: PromptEntity, chosenProposal: ProposalEntity): Promise<Boolean> {
    return (
      prompt.currentIndex === prompt.limitOfExtensions ||
      (await this.chosenProposalWasConclusive(prompt, chosenProposal))
    )
  }

  async chosenProposalWasConclusive(prompt: PromptEntity, proposal: ProposalEntity): Promise<boolean> {
    const storyPopularity = prompt.popularity
    const amountOfConclusiveReactions = await this.getAmountOfConclusiveReactions(proposal)
    const { completionPercentage } = await this.constantRepository.getConfig()
    return amountOfConclusiveReactions >= Math.ceil(storyPopularity * completionPercentage)
  }

  async getAmountOfConclusiveReactions(proposal: ProposalEntity): Promise<number> {
    return this.proposalRepository.getAmountOfConclusiveReactions(proposal)
  }
}

function no<T>(array: T[]): boolean {
  return array.length === 0
}