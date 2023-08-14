/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/genre', 'GenresController').apiOnly()
    Route.post('/genre/:id/word', 'GenresController.storeWords')
  }).middleware('auth')
}
