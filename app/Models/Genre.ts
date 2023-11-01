import { DateTime } from 'luxon'
import {
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
import { PromptEntity, GenreEntity, ThematicWordEntity } from '@ioc:forfabledomain'
import { BaseAdonisModel } from './_Base'


export default class Genre extends BaseAdonisModel implements GenreEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public imageUrl: string

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
  public static async setGenrePopularity(genre: Genre): Promise<void> {
    const amountOfNonDailyPrompts = await getAmountOfNonDailyPrompts(genre)
    return GenreEntity.calculateGenrePopularity(genre, amountOfNonDailyPrompts)
  }

  @afterFetch()
  public static async calculateGenreArrayPopularity(genresArray: Genre[]) {
    for (const genre of genresArray) {
      await Genre.setGenrePopularity(genre)
    }
  }

  
  public async calculateGenrePopularity(genre: Genre): Promise<void> {
    const amountOfNonDailyPrompts = await getAmountOfNonDailyPrompts(genre)
    return GenreEntity.calculateGenrePopularity(genre, amountOfNonDailyPrompts)
  }

  public async getPrompts(this: Genre): Promise<PromptEntity[]> {
    await this.load('prompts')
    return this.prompts
  }
  public async getThematicWords(this: Genre): Promise<ThematicWordEntity[]> {
    await this.load('thematicWords')
    return this.thematicWords
  }
}


async function getAmountOfNonDailyPrompts(genre: Genre): Promise<number> {
  const query = await Database.from('genres')
    .join('genre_prompt', 'genres.id', '=', 'genre_prompt.genre_id')
    .join('prompts', 'genre_prompt.prompt_id', '=', 'prompts.id')
    .where('prompts.is_daily', '=', false)
    .where('genres.id', '=', genre.id)
    .count('* as total')

  return query[0].total
}
