import { GenreEntity, GenreInsert, GenresRepository, Pagination } from "@ioc:forfabledomain"
import Genre from "App/Models/Genre"
import ThematicWord from "App/Models/ThematicWord"
import { paginate } from "./utils"

export class GenrePersistence implements GenresRepository {
  public static instance = new GenrePersistence()

  async create(body: Omit<GenreInsert, "thematicWords">): Promise<GenreEntity> {
      return await Genre.create(body)
  }

  async loadGenresWithWords(page?: number, limit?: number): Promise<Pagination<GenreEntity>> {
    return paginate(
      await Genre.query()
        .preload('thematicWords')
        .paginate(page || 1, limit)
    )
  }

  async find(entityId: number): Promise<GenreEntity | null> {
    const genre = await Genre.find(entityId)
    if (genre) {
        await genre.load('thematicWords')
        return genre
    } else {
        return null
    }
  }

  async findAll(page?: number, limit?: number): Promise<Pagination<GenreEntity>> {
    return paginate(await Genre.query().paginate(page || 1, limit))
  }

  async delete(entityId: number): Promise<GenreEntity | null> {
    const genre = await Genre.find(entityId)
    if (genre) {
        genre.delete()
        return genre
    } else {
        return null
    }
  }

  async update(entityId: number, partialBody: Partial<GenreEntity>): Promise<GenreEntity | null> {
    const genre = await Genre.find(entityId)
    if (genre) {
        genre.merge(partialBody)
        await genre.save()
        return genre
    } else {
        return null
    }
  }

  async eraseAllWordsFromGenre(genre: Genre): Promise<void> {
    for (const word of genre.thematicWords) {
      await word.delete()
    }
  }

  async wordAlreadyInGenre(word: string, genreId: GenreEntity['id']): Promise<boolean> {
    return !!(await ThematicWord.query().where('text', word).where('genreId', genreId).first())
  }
}