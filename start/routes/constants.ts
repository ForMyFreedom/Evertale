import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.put('/constants', 'ConstantsController.update')
  }).middleware('auth').middleware('adminRoutes')

  Route.get('/constants', 'ConstantsController.index')
}