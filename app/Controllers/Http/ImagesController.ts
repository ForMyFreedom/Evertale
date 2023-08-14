import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageService from 'App/Services/ImageService'

export default class ImagesController {
  public async load({ response, params }: HttpContextContract): Promise<void> {
    await ImageService.recoverImage(response, params.imageId)
  }
}
