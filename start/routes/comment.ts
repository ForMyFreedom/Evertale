/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/comment', 'CommentsController').apiOnly().except(['index', 'show'])
    Route.get('/comment-by-write/:id', 'CommentsController.indexByWrite')
  }).middleware('auth')
}
