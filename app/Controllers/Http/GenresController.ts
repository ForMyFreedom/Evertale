import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Genre from 'App/Models/Genre'
import ExceptionHandler from 'App/Exceptions/Handler'
import ThematicWord from 'App/Models/ThematicWord'
import ImageService from '../Services/ImageService'

export default class GenresController {
  public async store({ request, response }: HttpContextContract): Promise<void> {
    const { tematicWords, ...rest } = request.body()
    const genre = await Genre.create(rest)
    genre.image = await ImageService.uploadImage(request, response)
    genre.save()

    for (const word of JSON.parse(tematicWords)) {
      await ThematicWord.create({ text: word, genreId: genre.id })
    }
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
    let genre = await Genre.find(request.param('id'))
    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      genre.merge(request.body())
      genre.save()
      ExceptionHandler.SucessfullyUpdated(response, genre)
    }
  }

  public async destroy({ params, response }: HttpContextContract): Promise<void> {
    const genre = await Genre.find(params.id)
    if (!genre) {
      ExceptionHandler.UndefinedId(response)
    } else {
      genre.delete()
      response.accepted(genre)
    }
  }
}
