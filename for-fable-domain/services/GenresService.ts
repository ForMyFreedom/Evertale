
import { BaseHTTPService } from './BaseHTTPService'
import { GenreEntity, GenreInsert } from '../entities'
import { ThematicWordRepository, ExceptionHandler, GenresRepository } from '../contracts'
import { GenresUsecase } from '../usecases'

export class GenresService extends BaseHTTPService implements GenresUsecase {
  constructor(
    private readonly genreRepository: GenresRepository,
    private readonly thematicWordRepository: ThematicWordRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async store(body: GenreInsert): Promise<void> {
    let { thematicWords, ...rest } = body
    const genre = await this.genreRepository.create(rest)
    await this.storeWordsToGenre(thematicWords, genre)
    this.exceptionHandler.SucessfullyCreated(genre)
  }

  public async index(): Promise<void> {
    this.exceptionHandler.SucessfullyRecovered(
      await this.genreRepository.loadGenresWithWords()
    )
  }

  public async show(genreId: GenreEntity['id']): Promise<void> {
    const genre = await this.genreRepository.find(genreId)
    if (!genre) {
      this.exceptionHandler.UndefinedId()
    } else {
      this.exceptionHandler.SucessfullyRecovered(genre)
    }
  }

  public async update(genreId: GenreEntity['id'], body: Partial<GenreInsert>): Promise<void> {
    const { thematicWords, ...rest } = body

    let genre = await this.genreRepository.find(genreId)
    if (!genre) {
      this.exceptionHandler.UndefinedId()
    } else {
      await this.genreRepository.update(genreId, rest)

      if (thematicWords) {
        await this.genreRepository.eraseAllWordsFromGenre(genre)
        await this.storeWordsToGenre(thematicWords, genre)
      }

      this.exceptionHandler.SucessfullyUpdated(genre)
    }
  }

  public async destroy(genreId: GenreEntity['id']): Promise<void> {
    const genre = await this.genreRepository.find(genreId)
    if (!genre) {
      this.exceptionHandler.UndefinedId()
    } else {
      await this.genreRepository.delete(genreId)
      this.exceptionHandler.SucessfullyDestroyed(genre)
    }
  }

  public async storeWords(genreId: GenreEntity['id'], words: string[]): Promise<void> {
    const genre = await this.genreRepository.find(genreId)

    if (!genre) {
      this.exceptionHandler.UndefinedId()
    } else {
      await this.storeWordsToGenre(words, genre)
      const updatedGenre = await this.genreRepository.find(genreId)
      this.exceptionHandler.SucessfullyCreated(updatedGenre)
    }
  }

  async storeWordsToGenre(thematicWords: string[], genre: GenreEntity): Promise<void> {
    for (const word of thematicWords) {
      if (!(await this.genreRepository.wordAlreadyInGenre(word, genre.id))) {
        await this.thematicWordRepository.create({ text: word, genreId: genre.id })
      }
    }
  }

}
