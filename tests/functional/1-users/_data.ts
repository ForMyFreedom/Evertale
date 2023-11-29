import Env from '@ioc:Adonis/Core/Env'
import { ApiClient } from '@japa/api-client/build/src/client'
import { UserValidatorSchema } from 'App/Validators/UserValidator'
import { DateTime } from 'luxon'
import { ConnectionType, postWithAuth } from '../_utils/basic-auth-requests'
import User from 'App/Models/User'

export const BASE_URL = '/api/user'
export const BASE_ADMIN_URL = '/api/admin'

export const NON_ADMIN_USER_SAMPLE: typeof UserValidatorSchema.props = {
  name: 'commum-user',
  email: 'commumuser@gmail.com',
  birthDate: DateTime.now().minus({ years: 20 }),
  password: Env.get('USER_ROOT_PASSWORD'),
  repeatPassword: Env.get('USER_ROOT_PASSWORD'),
}


export const ADMIN_USER_SAMPLE: typeof UserValidatorSchema.props = {
  name: 'some-admin',
  email: 'someadmin@gmail.com',
  birthDate: DateTime.now().minus({ years: 20 }),
  password: Env.get('USER_ROOT_PASSWORD'),
  repeatPassword: Env.get('USER_ROOT_PASSWORD'),
}

export const EDIT_NON_ADMIN_USER: Partial<typeof UserValidatorSchema.props> = {
  name: 'other-name',
}

export const EDIT_NON_ADMIN_USER_2: Partial<typeof UserValidatorSchema.props> = {
  name: 'other-other-name',
}

export const WRONG_USER_SAMPLE = {
  email: 'test@gmail.com',
  isAdmin: false,
}

export const postUser = async (
  client: ApiClient, user: typeof UserValidatorSchema.props, isAdmin: boolean = true
): Promise<User> => {
  if (isAdmin) {
    const response = await postWithAuth(BASE_ADMIN_URL, client, ConnectionType.Admin, user)
    return response.body().data as User
  } else {
    const response = await postWithAuth(BASE_URL, client, ConnectionType.Admin, user)
    return response.body().data as User
  }
}
