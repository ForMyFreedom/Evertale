import { DateTime } from 'luxon'
import { GenreEntity } from './Genre'

export type ThematicWordInsert = {
  words: string[]
} & Pick<ThematicWordEntity, 'genreId'>

export abstract class ThematicWordEntity {
  id: number
  text: string
  genreId: GenreEntity['id']
  createdAt: DateTime
  updatedAt: DateTime

  abstract getGenre(): Promise<GenreEntity>
}
