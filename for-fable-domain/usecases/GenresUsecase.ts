
import { GenreEntity, GenreInsert } from '../entities'

export interface GenresUsecase {
  store(body: GenreInsert): Promise<void>
  index(): Promise<void>
  show(genreId: GenreEntity['id']): Promise<void>
  update(genreId: GenreEntity['id'], body: Partial<GenreInsert>): Promise<void>
  destroy(genreId: GenreEntity['id']): Promise<void>
  storeWords(genreId: GenreEntity['id'], words: string[]): Promise<void>
}
