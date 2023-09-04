import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  ManyToMany,
  afterFetch,
  afterFind,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ThematicWord from './ThematicWord'
import Prompt from './Prompt'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public image: string

  @computed()
  public popularity: number // Amount of Prompts per day

  @manyToMany(() => Prompt)
  public prompts: ManyToMany<typeof Prompt>

  @hasMany(() => ThematicWord)
  public thematicWords: HasMany<typeof ThematicWord>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFind()
  public static async calculateGenrePopularity(genre: Genre) {
    const amountOfPrompts = await getAmountOfNonDailyPrompts(genre)
    const startDate = genre.createdAt
    const actualDate = DateTime.now()
    const daysOfExistence = startDate.diff(actualDate).days

    genre.popularity = amountOfPrompts / (daysOfExistence + 1)
  }

  @afterFetch()
  public static async calculateGenreArrayPopularity(genresArray: Genre[]) {
    for (const genre of genresArray) {
      await Genre.calculateGenrePopularity(genre)
    }
  }
}

async function getAmountOfNonDailyPrompts(genre: Genre) {
  const query = await Database.from('genres')
    .join('genre_prompt', 'genres.id', '=', 'genre_prompt.genre_id')
    .join('prompts', 'genre_prompt.prompt_id', '=', 'prompts.id')
    .where('prompts.is_daily', '=', false)
    .where('genres.id', '=', genre.id)
    .count('* as total')

  return query[0].total
}
