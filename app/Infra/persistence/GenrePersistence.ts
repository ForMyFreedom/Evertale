import { GenreEntity, GenreInsert, GenresRepository } from "@ioc:forfabledomain"
import Genre from "App/Models/Genre"
import ThematicWord from "App/Models/ThematicWord"

export class GenrePersistence implements GenresRepository {
  public static instance = new GenrePersistence()

  async create(body: Omit<GenreInsert, "thematicWords">): Promise<GenreEntity> {
      return await Genre.create(body)
  }

  async loadGenresWithWords(): Promise<GenreEntity[]> {
    return await Genre.query().preload('thematicWords')
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

  async findAll(): Promise<GenreEntity[]> {
    return Genre.all()
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