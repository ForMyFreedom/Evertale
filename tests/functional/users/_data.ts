import Env from '@ioc:Adonis/Core/Env'
import { UserValidatorSchema } from 'App/Validators/UserValidator'
import { DateTime } from 'luxon'
import ExceptionHandler from 'App/Exceptions/Handler'

export const BASE_URL = '/api/user'

export const ExceptionContract =  ExceptionHandler.contract

export const DEFAULT_BANK = {
  data: [
    {
      id: 1,
      name: 'root',
      email: Env.get('USER_ROOT_EMAIL'),
      image: null,
      is_admin: true,
      score: 0,
    },
  ],
}

export const NON_ADMIN_USER: typeof UserValidatorSchema.props = {
  name: 'non-root',
  email: 'test@gmail.com',
  image: 'https://great-awesome-epic-incredible-image.wow/1',
  isAdmin: false,
  score: 0,
  birthDate: DateTime.now(),
  password: Env.get('USER_ROOT_PASSWORD'),
}

export const EDIT_NON_ADMIN_USER: Partial<typeof UserValidatorSchema.props> = {
  image: 'https://great-awesome-epic-incredible-image.wow/2',
}

export const RIGHT_USER: typeof UserValidatorSchema.props = {
  name: 'test-insert',
  email: 'test-insert@gmail.com',
  image: 'https://great-awesome-epic-incredible-image.wow/3',
  isAdmin: false,
  score: 0,
  birthDate: DateTime.now(),
  password: '*********',
}

export const WRONG_USER = {
  email: 'test@gmail.com',
  image: null,
  isAdmin: false,
}
