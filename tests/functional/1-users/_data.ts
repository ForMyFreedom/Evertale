import Env from '@ioc:Adonis/Core/Env'
import { ApiClient } from '@japa/api-client/build/src/client'
import { UserValidatorSchema } from 'App/Validators/UserValidator'
import { DateTime } from 'luxon'
import { postWithAuth } from '../_utils/basic-auth-requests'
import User from 'App/Models/User'

export const BASE_URL = '/api/user'
export const BASE_ADMIN_URL = '/api/admin'

export const NON_ADMIN_USER_SAMPLE: typeof UserValidatorSchema.props = {
  name: 'commum-user',
  email: 'commumuser@gmail.com',
  image: 'https://great-awesome-epic-incredible-image.wow/1',
  birthDate: DateTime.now(),
  password: Env.get('USER_ROOT_PASSWORD'),
  repeatPassword: Env.get('USER_ROOT_PASSWORD'),
}


export const ADMIN_USER_SAMPLE: typeof UserValidatorSchema.props = {
  name: 'some-admin',
  email: 'someadmin@gmail.com',
  image: 'https://great-awesome-epic-incredible-image.wow/2',
  birthDate: DateTime.now(),
  password: Env.get('USER_ROOT_PASSWORD'),
  repeatPassword: Env.get('USER_ROOT_PASSWORD'),
}

export const EDIT_NON_ADMIN_USER: Partial<typeof UserValidatorSchema.props> = {
  image: 'https://great-awesome-epic-incredible-image.wow/2',
}

export const WRONG_USER_SAMPLE = {
  email: 'test@gmail.com',
  image: null,
  isAdmin: false,
}

export const postUser = async (
  client: ApiClient, user: typeof UserValidatorSchema.props, isAdmin: boolean = true
): Promise<User> => {
  if (isAdmin) {
    const response = await postWithAuth(BASE_ADMIN_URL, client, true, user)
    return response.body().data as User
  } else {
    const response = await postWithAuth(BASE_URL, client, true, user)
    return response.body().data as User
  }
}
