/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly()
    Route.post('/auth/register', 'AuthController.register')
    Route.get('/image/:imageId', 'ImagesController.load')
  }).middleware('auth').middleware('adminRoutes')
}
