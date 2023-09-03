/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/prompt', 'PromptsController').apiOnly()
    Route.post('/prompt/appropriate/:id', 'DailyPromptsController.AppropriateDailyPrompt')
  }).middleware('auth')
}
