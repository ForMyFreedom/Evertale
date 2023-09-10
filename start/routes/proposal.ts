import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/proposal', 'ProposalsController').apiOnly().except(['index'])
    Route.get('/proposals-by-prompt/:id', 'ProposalsController.indexByPrompt')
    Route.get('/proposals-by-prompt/:id/actual', 'ProposalsController.actualIndexByPrompt')
  }).middleware('auth')
}
