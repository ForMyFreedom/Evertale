/* eslint-disable prettier/prettier */
import Application from '@ioc:Adonis/Core/Application'
import { FileValidationOptions, MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
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

  public static async uploadImage(request: RequestContract, response: ResponseContract, folder: string): Promise<string> {
    let image: MultipartFileContract|null = null
    try{
      image = request.file('image', this.imageValidation)
    } catch {
      ExceptionHandler.ImageError(response)
    }

    if (image) {
      const imageName = `${uuid()}.${image.extname}`
      await image.move(Application.tmpPath('uploads\\'+folder), {
        name: imageName,
      })
      return imageName
    }else{
      throw ExceptionHandler.ImageError(response)
    }
  }

  public static async deleteImage(imageName: string, folder: string): Promise<void> {
    try{
      fs.unlinkSync(`${Application.tmpPath('uploads')}\\${folder}\\${imageName}`)
    } catch { }
  }

  public static async recoverImage(response: ResponseContract, imageName: string): Promise<void> {
    const folderList = fs.readdirSync(Application.tmpPath('uploads'))
    for (const folder of folderList) {
      const filePath = `${Application.tmpPath('uploads')}\\${folder}\\${imageName}`
      if (fs.existsSync(filePath)) {
        response.download(`${Application.tmpPath('uploads')}\\${folder}\\${imageName}`)
        return
      }
    }
    ExceptionHandler.FileNotFound(response)
  }
}
