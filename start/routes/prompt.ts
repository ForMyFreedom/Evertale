import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/prompt', 'PromptsController').apiOnly()
  }).middleware('auth')
}
