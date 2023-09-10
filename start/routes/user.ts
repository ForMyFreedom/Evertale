/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly().only(['update'])
  }).middleware('auth').middleware('adminRoutes')

  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly().except(['store', 'update'])
  }).middleware('auth')

  Route.post('/user', 'UsersController.store')

  Route.get('/verify-email/:token', 'UsersController.verifyEmail')
}
