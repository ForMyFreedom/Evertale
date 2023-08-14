/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import GenreRoute from './routes/genre'
import UserRoute from './routes/user'

Route.where('id', Route.matchers.number())

Route.group(() => {
  Route.get('/', async () => {
    return { response: 'welcome' }
  })

  Route.get('/image/:imageId', 'ImagesController.load')
  GenreRoute()
  UserRoute()
}).prefix(Env.get('BASE_ROUTE_PREFIX'))
