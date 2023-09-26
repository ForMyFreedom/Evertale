import { BaseHTTPService } from './BaseHTTPService'
import { ExceptionHandler, ProposalRepository, WriteRepository, PromptRepository, ReactWriteRepository } from '../contracts'
import { UserEntity, ReactionType, getExibitionReaction, WriteEntity, WriteReactionEntity, WriteReactionInsert, reactionIsConclusive } from '../entities'
import { ReactWritesUsecase } from '../usecases'

export class ReactWritesService extends BaseHTTPService implements ReactWritesUsecase {
  constructor(
    private readonly reactWriteRepository: ReactWriteRepository,
    private readonly writeRepository: WriteRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly promptRepository: PromptRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async show(writeId: WriteEntity['id']): Promise<void> {
    const write = await this.writeRepository.find(writeId)
    if (!write) {
      return this.exceptionHandler.UndefinedId()
    }
    const bruteReactions =
      await this.reactWriteRepository.getBruteReactions(writeId)
    
    const reactions = getExibitionReaction(bruteReactions)
    this.exceptionHandler.SucessfullyRecovered(reactions)
  }

  public async store(userId: UserEntity['id']|undefined, body: WriteReactionInsert): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const write = await this.writeRepository.find(body.writeId)

    if (!write) {
      return this.exceptionHandler.UndefinedWrite()
    }

    if (write.authorId == userId) {
      return this.exceptionHandler.CantReactYourself()
    }

    if (body.type === ReactionType.COMPLAINT && await this.writeIsDaily(body.writeId)) {
      return this.exceptionHandler.CantComplaintToDailyWrite()
    }

    if (reactionIsConclusive(body.type)) {
      if (await this.promptRepository.findByWriteId(body.writeId)) {
        return this.exceptionHandler.CantUseConclusiveReactionInPrompt()
      } else {
        const writeIsProposal = await this.proposalRepository.findByWriteId(write.id)
        if (writeIsProposal) {
          if (await this.promptRepository.promptIsConcluded(writeIsProposal.promptId)) {
            return this.exceptionHandler.CantUseConclusiveReactionInConcludedHistory()
          }
        }
      }
    }

    const couldFind = await this.reactWriteRepository.getCertainReaction(userId, write.id)
    
    if (couldFind) {
      await this.reactWriteRepository.delete(couldFind.id)
    }

    const reaction = await this.reactWriteRepository.create({
      ...body, userId: userId
    })

    this.exceptionHandler.SucessfullyCreated(reaction)
  }

  public async destroy(userId: UserEntity['id']|undefined, reactionId: WriteReactionEntity['id']): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const reaction = await this.reactWriteRepository.find(reactionId)
    if (!reaction) {
      return this.exceptionHandler.UndefinedId()
    }
  
    if (userId === reaction.userId) {
      await this.reactWriteRepository.delete(reactionId)
      this.exceptionHandler.SucessfullyDestroyed(reaction)
    } else {
      this.exceptionHandler.CantDeleteOthersReaction()
    }
  }

  async writeIsDaily(writeId: number): Promise<Boolean> {
    const prompts = await this.promptRepository.findByWriteId(writeId)
    return !!prompts && prompts.isDaily
  }
}

