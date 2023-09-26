import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/constants', 'ConstantsController')
  }).middleware('auth').middleware('adminRoutes')
}