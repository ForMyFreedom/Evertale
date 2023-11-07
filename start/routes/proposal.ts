import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/proposal', 'ProposalsController').apiOnly().except(['index'])
  }).middleware('auth')

  Route.get('/proposal/author/:id', 'ProposalsController.indexByAuthor')
  Route.get('/proposal/prompt/:id', 'ProposalsController.indexByPrompt')
  Route.get('/proposal/prompt/:id/actual', 'ProposalsController.actualIndexByPrompt')
}
