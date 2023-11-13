import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyValidator } from './MyValidator'
import { SchemaTyper } from 'App/Utils/secure'
import { ImageFolders, ImageFoldersConst } from '@ioc:forfabledomain'
import Env from '@ioc:Adonis/Core/Env'

type InsertType = {
  image: MultipartFileContract,
  folder: ImageFolders
}

const imageSchema = schema.file({
  extnames: ['jpg', 'gif', 'png', 'jpeg'],
  size: `${Env.get('MB_MAX_ALLOWED_IMAGE_SIZE')}mb`,
})

export const ImageAndFolderValidatorSchema: SchemaTyper<InsertType> = schema.create({
  image: imageSchema,
  folder: schema.enum(Object.values(ImageFoldersConst)),
})

export const ImageValidatorSchema: SchemaTyper<Omit<InsertType,'folder'>> = schema.create({
  image: imageSchema,
})

const messages = {
  'image.file.extname': 'The image extension is not valid',
  'image.file.size': 'The image in huge!',
  'image.file': 'The image is not valid',
  'folder.enum': 'The folder is not valid',
  'image.required': 'The image is required',
  'folder.required': 'The folder is required',
}

export class ImageValidator extends MyValidator<typeof ImageValidatorSchema> {
  constructor(protected ctx: HttpContextContract) { super(ctx) }

  public GetSchema(): typeof ImageValidatorSchema { return ImageValidatorSchema }

  protected GetMessages(): CustomMessages { return messages }
}

export class ImageAndFolderValidator extends MyValidator<typeof ImageAndFolderValidatorSchema> {
  constructor(protected ctx: HttpContextContract) { super(ctx) }

  public GetSchema(): typeof ImageAndFolderValidatorSchema { return ImageAndFolderValidatorSchema }

  protected GetMessages(): CustomMessages { return messages }
}
