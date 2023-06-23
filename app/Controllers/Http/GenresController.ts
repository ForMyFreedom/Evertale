import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Genre from 'App/Models/Genre'
import ExceptionHandler from 'App/Exceptions/Handler'
import ThematicWord from 'App/Models/ThematicWord'
import ImageService from '../../Services/ImageService'
import GenreValidator from 'App/Validators/GenreValidator'
import ThematicWordValidator from 'App/Validators/ThematicWordValidator'

export default class GenresController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { request, response } = ctx
    const body = await new GenreValidator(ctx).validate()
    let { thematicWords, ...rest } = body

    const genre = await Genre.create(rest)
    genre.image = await ImageService.uploadImage(request, response)
    genre.save()

    await storeWordsToGenre(thematicWords, genre)
    ExceptionHandler.SucessfullyCreated(response, genre)
  }

  public async index({ response }: HttpContextContract): Promise<void> {
    const genres = await Genre.query().preload('thematicWords')
    ExceptionHandler.SucessfullyRecovered(response, genres)
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    const genre = await Genre.find(params.id)
    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      await genre.load('thematicWords')
      ExceptionHandler.SucessfullyRecovered(response, genre)
    }
  }

  public async update({ request, response }: HttpContextContract): Promise<void> {
    const { thematicWords, ...rest } = request.body()

    let genre = await Genre.find(request.param('id'))
    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      genre.merge(rest)
      genre.save()
      await genre.load('thematicWords')
      await eraseAllWordsFromGenre(genre)
      await storeWordsToGenre(thematicWords, genre)
      await genre.load('thematicWords')
      ExceptionHandler.SucessfullyUpdated(response, genre)
    }
  }

  public async destroy({ params, response }: HttpContextContract): Promise<void> {
    const genre = await Genre.find(params.id)
    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      genre.delete()
      await genre.load('thematicWords')
      ImageService.deleteImage(genre.image)
      response.accepted(genre)
    }
  }

  public async storeWords(ctx: HttpContextContract): Promise<void> {
    const { params, response } = ctx
    const words = (await new ThematicWordValidator(ctx).validate()).words
    const genre = await Genre.find(params.id)

    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      await storeWordsToGenre(words, genre)
      await genre.load('thematicWords')
      ExceptionHandler.SucessfullyUpdated(response, genre)
    }
  }
}

async function storeWordsToGenre(thematicWords: string[], genre: Genre): Promise<void> {
  for (const word of thematicWords) {
    if (!(await wordAlreadyInGenre(word, genre))) {
      await ThematicWord.create({ text: word, genreId: genre.id })
    }
  }
}

async function eraseAllWordsFromGenre(genre: Genre): Promise<void> {
  for (const word of genre.thematicWords) {
    await word.delete()
  }
}

async function wordAlreadyInGenre(word: string, genre: Genre): Promise<boolean> {
  return !!(await ThematicWord.query().where('text', word).where('genreId', genre.id).first())
}
