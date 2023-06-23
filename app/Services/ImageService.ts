/* eslint-disable prettier/prettier */
import Application from '@ioc:Adonis/Core/Application'
import { FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'
import { v4 as uuid } from 'uuid'
import ExceptionHandler from 'App/Exceptions/Handler'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import fs from 'fs'

export default class ImageService {
  private static imageValidation: FileValidationOptions = {
    extnames: ['image'],
    size: '2mb',
  }

  public static async uploadImage(request: RequestContract, response: ResponseContract): Promise<string> {
    const image = request.file('image', this.imageValidation)

    if (image) {
      const imageName = `${uuid()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })
      return imageName
    }else{
      throw ExceptionHandler.ImageError(response)
    }
  }

  public static async deleteImage(imageName: string): Promise<void> {
    try{
      fs.unlinkSync(`${Application.tmpPath('uploads')}\\${imageName}`)
    } catch { }
  }
}
