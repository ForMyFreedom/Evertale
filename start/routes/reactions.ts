/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/react-comment', 'ReactCommentsController').apiOnly().except(['index', 'update'])
    Route.resource('/react-write', 'ReactWritesController').apiOnly().except(['index', 'update'])
  }).middleware('auth')
}
