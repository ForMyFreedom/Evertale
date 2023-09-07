import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.get('/constants', 'ConstantsController.show')
    Route.put('/constants', 'ConstantsController.update')
    Route.put('/constants/:id', 'ConstantsController.update')
  }).middleware('auth').middleware('adminRoutes')
}