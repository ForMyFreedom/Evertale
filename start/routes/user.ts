import Route from '@ioc:Adonis/Core/Route'

export default function routes(){
  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly().only(['update'])
    Route.post('/admin', 'UsersController.storeAdmin')
  }).middleware('auth').middleware('adminRoutes')

  Route.group(() => {
    Route.resource('/user', 'UsersController').apiOnly().except(['store', 'update'])
    Route.get('/request-password-change', 'UsersController.requestPasswordChange')
  }).middleware('auth')

  Route.post('/user', 'UsersController.storeUser')
  Route.post('/login', 'LoginController.loginByCredential')

  Route.get('/verify-email/:token', 'UsersController.verifyEmail')
  Route.post('restartPassword/:token', 'UsersController.restartPassword')
}
