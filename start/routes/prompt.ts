import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/prompt', 'PromptsController').apiOnly().except(['index', 'show'])
    Route.post('/prompt/appropriate/:id', 'PromptsController.appropriateDailyPrompt')
  }).middleware('auth')

  Route.resource('/prompt', 'PromptsController').apiOnly().only(['index', 'show'])
  Route.get('/prompt/author/:id', 'PromptsController.indexByAuthor')
}
