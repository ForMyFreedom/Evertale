import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { UsesUsecase } from './_Conversor'
import { ImageInsert, ImagesController } from '@ioc:forfabledomain'
import ImageProvider from '@ioc:Providers/ImageService'
import { ImageAndFolderValidator, ImageValidator } from 'App/Validators/ImageValidator'
import lodashMerge from 'lodash/merge'

export default class ImagesAdonisController implements UsesUsecase<ImagesController> {
    public async restore(ctx: HttpContextContract) {
        const path: string = safePath(ctx.request.param('*').join('/'))
        await ImageProvider(ctx).restore(path)
    }

    public async postImage(ctx: HttpContextContract) {
        const { user } = ctx.auth
        
        const allData = lodashMerge({}, ctx.request.all(), ctx.request.allFiles())
        ctx.request.updateBody(allData)
        const { image, folder } = await new ImageAndFolderValidator(ctx).validate()

        if (image.isValid && folder != 'user'){
            const refinedImage = buildImageInsert(image)
            await ImageProvider(ctx).postImage(user, refinedImage, folder)
        } else {
            ctx.response.badRequest()
        }
    }

    public async updateUserImage(ctx: HttpContextContract) {
        const { user } = ctx.auth

        const allData = lodashMerge({}, ctx.request.all(), ctx.request.allFiles())
        ctx.request.updateBody(allData)
        const { image } = await new ImageValidator(ctx).validate()

        if(image.isValid){
            const refinedImage = buildImageInsert(image)
            await ImageProvider(ctx).updateUserImage(user, refinedImage)
        } else {
            ctx.response.badRequest()
        }
    }
}

function buildImageInsert(bruteImage: MultipartFileContract): ImageInsert {
    return {
        name: bruteImage.clientName,
        extension: bruteImage.extname || '',
        sizeInBytes: bruteImage.size,
        move: async (path: string, savingName: string) => {
            await bruteImage.move(path, {name: savingName})
        }
    }
}

function safePath(path: string): string {
    return path.replace(/\.\./g, '')
}