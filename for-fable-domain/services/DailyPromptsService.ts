import { GenreEntity, ThematicWordEntity } from '../entities'
import { GenresRepository, PromptRepository, WriteRepository } from '../contracts'
import { DailyPromptsUsecase } from '../usecases'

export class DailyPromptsService implements DailyPromptsUsecase {
  public static SEPARATOR = ' | '

  constructor(
    private readonly promptRepository: PromptRepository,
    private readonly writeRepository: WriteRepository,
    private readonly genreRepository: GenresRepository,
  ) { }

  public async deleteAllNonAppropriatedDailyPrompts(): Promise<void> {
    const allDailyPrompts = await this.promptRepository.getAllDailyPrompt()
    for (const prompt of allDailyPrompts) {
      if ((await prompt.getWrite()).authorId === null) {
        await this.promptRepository.delete(prompt.id)
      }
    }
  }

  public async createDailyPromptsForEachGenre(): Promise<void> {
    const allGenres = await this.genreRepository.findAll()
    for (const genre of allGenres) {
      for (let i = 0; i < genre.popularity; i++) {
        const newWrite = await this.writeRepository.create({
          text: await this.getRandomText(genre),
          authorId: null,
        })

        const newPrompt = await this.promptRepository.create({
          title: '---',
          isDaily: true,
          writeId: newWrite.id,
          maxSizePerExtension: this.getRandomMaxSizePerExtension(),
          limitOfExtensions: this.getRandomLimitOfExtensions(),
          timeForAvanceInMinutes: this.getRandoTimeForAdvanceInMinutes(),
        })

        await this.promptRepository.setGenresInPrompt(newPrompt, [genre.id])
      }
    }
  }

  private async getRandomText(genre: GenreEntity): Promise<string> {
    let text = ''
    let thematicWords: ThematicWordEntity[] = await genre.getThematicWords()
    const amount = thematicWords.length < 3 ? thematicWords.length : 3
    for (let i = 0; i < amount; i++) {
      const word = getRandomWord(thematicWords).text
      thematicWords = thematicWords.filter((w) => w.text !== word)
      text += word
      if (i + 1 !== amount) {
        text += DailyPromptsService.SEPARATOR
      }
    }
    return text
  }

  private getRandomMaxSizePerExtension(): number {
    return Math.floor(20 + 30 * Math.random())
  }

  private getRandomLimitOfExtensions(): number {
    if (Math.random() < 0.23) {
      return 2 - 3
    } else {
      return Math.floor(Math.random() * (2 + 3) + 2 + 3) // I like the 23 number...
    }
  }

  private getRandoTimeForAdvanceInMinutes(): number {
    return Math.floor(2 + 3 + (2 + 3) * Math.random())
  }
}

function getRandomWord(thematicWords: ThematicWordEntity[]): ThematicWordEntity {
  return thematicWords[Math.floor(Math.random() * thematicWords.length)]
}