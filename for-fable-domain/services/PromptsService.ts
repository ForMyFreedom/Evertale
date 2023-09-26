import { BaseHTTPService } from './BaseHTTPService'
import { PromptEntity, PromptInsert, UserEntity, GenreEntity, GainControlOverDailyPromptInsert } from '../entities'
import { ExceptionHandler, PromptRepository, WriteRepository, EventEmitter } from '../contracts'
import { PromptsUsecase } from '../usecases'
import { DailyPromptsService } from './DailyPromptsService'

export class PromptsService extends BaseHTTPService implements PromptsUsecase {
  constructor(
    private readonly promptsRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    private readonly eventEmitter: EventEmitter,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async index(): Promise<void> {
    this.exceptionHandler.SucessfullyRecovered(
      await this.promptsRepository.findAll()
    )
  }

  public async show(promptId: PromptEntity['id']): Promise<void> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      this.exceptionHandler.UndefinedId()
    } else {
      this.exceptionHandler.SucessfullyRecovered(prompt)
    }
  }

  public async store(authorId: UserEntity['id']|undefined, body: PromptInsert): Promise<void> {
    const { text, genreIds, ...rest } = body
    if(!authorId) {
      return this.exceptionHandler.UndefinedId()
    }
    const write = await this.writeRepository.create({ text: text, authorId: authorId })
    const prompt = await this.promptsRepository.create({ ...rest, writeId: write.id })

    if (! await this.couldSetGenres(prompt, genreIds)) {
      await this.promptsRepository.delete(prompt.id)
      return this.exceptionHandler.InvalidGenre()      
    }

    await this.eventEmitter.emitRunPromptEvent(prompt)
    this.exceptionHandler.SucessfullyCreated(prompt)
  }

  public async update(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], partialPrompt: Partial<PromptInsert>): Promise<void> {
    const { text, limitOfExtensions, genreIds, ...rest } = partialPrompt
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      return this.exceptionHandler.UndefinedId()
    }
    const write = await prompt.getWrite()


    if (write.authorId !== userId) {
      return this.exceptionHandler.CantEditOthersWrite()
    }

    if (prompt.isDaily) {
      return this.exceptionHandler.CantEditDailyPrompt()
    }

    if (prompt.currentIndex === 0) {
      // Regulate "Virgin" Prompt Update Permissions
      if (text) {
        await this.writeRepository.update(write.id, { text: text, edited: true })
      }
      if (limitOfExtensions) {
        prompt.limitOfExtensions = limitOfExtensions
      }

      if (genreIds && genreIds.length > 0) {
        await this.promptsRepository.removeAllGenresFromPrompt(prompt)
        if (!(await this.couldSetGenres(prompt, genreIds))) {
          return this.exceptionHandler.InvalidGenre()
        }
      }
    }

    this.promptsRepository.update(promptId, rest)
    this.exceptionHandler.SucessfullyUpdated(prompt)
  }

  public async destroy(userId: UserEntity['id']|undefined, promptId: PromptEntity['id']): Promise<void> {
    const prompt = await this.promptsRepository.find(promptId)
    if (!prompt) {
      return this.exceptionHandler.UndefinedId()
    }

    if((await prompt.getWrite()).authorId == userId) {
      this.exceptionHandler.SucessfullyDestroyed(
        await this.promptsRepository.delete(promptId)
      )
    } else {
      this.exceptionHandler.CantDeleteOthersWrite()
    }
  }

  public async appropriateDailyPrompt(userId: UserEntity['id']|undefined, promptId: PromptEntity['id'], body: GainControlOverDailyPromptInsert): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const prompt = await this.promptsRepository.find(promptId)

    if (!prompt) {
      return this.exceptionHandler.UndefinedId()
    }

    const write = await prompt.getWrite()

    if (!prompt.isDaily || write.authorId !== null) {
      return this.exceptionHandler.NotAppropriablePrompt()
    }

    if (!this.textRespectPrompt(body.text, write.text)) {
      return this.exceptionHandler.TextDontRespectPrompt()
    }

    write.authorId = userId
    write.text = body.text
    prompt.title = body.title

    await this.promptsRepository.update(prompt.id, prompt)
    await this.writeRepository.update(write.id, write)
    this.exceptionHandler.SucessfullyUpdated(prompt)
  }

  private async couldSetGenres(prompt: PromptEntity, genreIds: GenreEntity['id'][]): Promise<boolean> {
    const couldSet = await this.promptsRepository.setGenresInPrompt(prompt, genreIds)
    return couldSet
  }

  private textRespectPrompt(text: string, prompt: string): boolean {
    const wordsInPrompt = prompt.split(DailyPromptsService.SEPARATOR)
    return wordsInPrompt.every((word) => text.toLowerCase().includes(word.toLocaleLowerCase()))
  }
}
