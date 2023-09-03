import Database from "@ioc:Adonis/Lucid/Database"
import Env from '@ioc:Adonis/Core/Env'
import { Group } from "@japa/runner"
import User from "App/Models/User"
import { DateTime } from "luxon"

export async function Setup(group: Group) {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
}

export const AdminCredentials = {
  name: Env.get('USER_ROOT_NAME'),
  email: Env.get('USER_ROOT_EMAIL'),
  password: Env.get('USER_ROOT_PASSWORD')
}

export const NonAdminCredentials = {
  name: Env.get('USER_TEST_NAME'),
  email: Env.get('USER_TEST_EMAIL'),
  password: Env.get('USER_TEST_PASSWORD')
}

export async function createNonAdminUser() {
  await User.create({
    name: NonAdminCredentials.name,
    password: NonAdminCredentials.password,
    email: NonAdminCredentials.email,
    isAdmin: false,
    birthDate: DateTime.fromISO('2003-02-03'),
  })
}