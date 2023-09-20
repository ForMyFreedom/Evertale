import { BaseHTTPService } from "./BaseHTTPService"
import { ProposalEntity, PromptEntity, UserEntity, ProposalInsert } from "../entities"
import { ExceptionHandler, WriteRepository, PromptRepository, ProposalRepository } from "../contracts"
import { ProposalsUsecase } from '../usecases'

export class ProposalsService extends BaseHTTPService implements ProposalsUsecase {
  constructor(
    private readonly proposalsRepository: ProposalRepository,
    private readonly promptRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async indexByPrompt(promptId: PromptEntity['id']): Promise<void> {
    const prompt = await this.promptRepository.find(promptId)
    if (!prompt) {
      return this.exceptionHandler.UndefinedId()
    }
    const proposals = await this.proposalsRepository.getProposalsByPrompt(promptId)
    this.exceptionHandler.SucessfullyRecovered(proposals)
  }

  public async actualIndexByPrompt(promptId: PromptEntity['id']): Promise<void> {
    const prompt = await this.promptRepository.find(promptId)
    if (!prompt) {
      return this.exceptionHandler.UndefinedId()
    }
    const proposals = await this.proposalsRepository.getIndexedProposalsByPrompt(promptId, prompt.currentIndex)
    this.exceptionHandler.SucessfullyRecovered(proposals)
  }

  public async show(proposalId: ProposalEntity['id']): Promise<void> {
    const proposal = await this.proposalsRepository.fullFind(proposalId)
    if (proposal) {
      this.exceptionHandler.SucessfullyRecovered(proposal)
    } else {
      this.exceptionHandler.UndefinedId()
    }
  }

  public async store(userId: UserEntity['id']|undefined, body: ProposalInsert ): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.InvalidUser()
    }

    const { text, promptId } = body
    const prompt = await this.promptRepository.find(promptId)

    if (!prompt) {
      return this.exceptionHandler.UndefinedWrite()
    }

    const promptWrite = await prompt.getWrite()

    if (prompt.concluded) {
      return this.exceptionHandler.CantProposeToClosedHistory()
    }

    if (prompt.isDaily && promptWrite.authorId === null) {
      return this.exceptionHandler.CantProposeToUnappropriatedPrompt()
    }

    if (prompt.maxSizePerExtension < text.length) {
      return this.exceptionHandler.TextLengthHigherThanAllowed()
    }

    const finalText = insertSpaceInStartOfText(text)

    const proposalWrite = await this.writeRepository.create(
      { text: finalText, authorId: userId }
    )

    const proposal = await this.proposalsRepository.create({
      ...body,
      writeId: proposalWrite.id,
      promptId: promptId,
      orderInHistory: prompt.currentIndex,
    })

    this.exceptionHandler.SucessfullyCreated(proposal)
  }

  public async update(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id'], partialBody: Partial<ProposalInsert>): Promise<void> {
    const proposal = await this.promptRepository.find(proposalId)
    if (!proposal) {
      return this.exceptionHandler.UndefinedId()
    }
    const writeProposal = await proposal.getWrite()

    if (writeProposal.authorId !== userId) {
      return this.exceptionHandler.CantEditOthersWrite()
    }

    const newProposal = await this.proposalsRepository.update(
      proposal.id, partialBody
    )
    
    this.exceptionHandler.SucessfullyUpdated(newProposal)
  }

  public async destroy(userId: UserEntity['id']|undefined, proposalId: ProposalEntity['id']): Promise<void> {
    const proposal = await this.proposalsRepository.find(proposalId)

    if (!proposal) {
      return this.exceptionHandler.UndefinedId()
    }

    const proposalWrite = await proposal.getWrite()

    if (proposalWrite.authorId === userId) {
      await this.proposalsRepository.delete(proposalId)
      this.exceptionHandler.SucessfullyDestroyed(proposal)
    } else {
      this.exceptionHandler.CantEditOthersWrite()
    }
  }
}


function insertSpaceInStartOfText(text: string): string {
  return text[0] === ' ' ? text : ' ' + text
}
