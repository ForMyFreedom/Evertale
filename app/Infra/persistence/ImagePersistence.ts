import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ImageFolders, ImageInsert, ImageRepository } from "@ioc:forfabledomain";
import Application from '@ioc:Adonis/Core/Application'
import { extname } from 'path'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'

export class AdonisImageWrapper implements ImageRepository {
  constructor(private readonly ctx: HttpContextContract) { }
  
  async post(image: ImageInsert, folder: ImageFolders): Promise<string|undefined> {
    const name = `${Date.now()}-${image.name}`
    await image.move(Application.tmpPath(`uploads/${folder}`), name)
    const hosterURL = Env.get('IMAGE_HOSTER_URL')
    return `${hosterURL}/${folder}/${name}`
  }

  async delete(path: string): Promise<void> {
    const pathWithoutHoster = path.replace(Env.get('IMAGE_HOSTER_URL') + '/', '')
    await Drive.delete(pathWithoutHoster)
  }

  async restore(path: string): Promise<File|undefined> {
    try{
      if(!await Drive.exists(path)) { return undefined }
      const stream = await Drive.getStream(path)
      const { size } = await Drive.getStats(path)
    
      this.ctx.response.type(extname(path))
      this.ctx.response.header('content-length', size)

      this.ctx.response.stream(stream)
      return stream as unknown as File
    } catch(err) {
      return undefined
    }
  }
}