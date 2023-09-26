import { DateTime } from 'luxon'
import { PromptEntity } from './Prompt'
import { ThematicWordEntity } from './ThematicWord'

export type GenreInsert = {
  thematicWords: string[]
} & Pick<GenreEntity, 'name'|'image'>

export abstract class GenreEntity {
  id: number
  name: string
  image: string
  popularity: number // Amount of Prompts per day
  createdAt: DateTime
  updatedAt: DateTime

  abstract getPrompts(): Promise<PromptEntity[]>
  abstract getThematicWords(): Promise<ThematicWordEntity[]>
  abstract calculateGenrePopularity(genre: GenreEntity, amountOfNonDailyPrompts: number): Promise<void>

  static async calculateGenrePopularity(genre: GenreEntity, amountOfNonDailyPrompts: number): Promise<void> {
    const startDate = genre.createdAt
    const actualDate = DateTime.now()
    const daysOfExistence = startDate.diff(actualDate).days
  
    genre.popularity = amountOfNonDailyPrompts / (daysOfExistence + 1)
  }
}

