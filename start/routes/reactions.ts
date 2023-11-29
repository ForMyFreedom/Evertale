import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/react-comment', 'ReactCommentsController').apiOnly().except(['index', 'update', 'show'])
    Route.resource('/react-write', 'ReactWritesController').apiOnly().except(['index', 'update', 'show'])
  }).middleware('auth')

  Route.group(() => {
    Route.resource('/react-comment', 'ReactCommentsController').apiOnly().only(['show'])
    Route.resource('/react-write', 'ReactWritesController').apiOnly().only(['show'])
  }).middleware('noAuth')
}
