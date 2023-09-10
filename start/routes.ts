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
import GenreRoutes from './routes/genre'
import UserRoutes from './routes/user'
import PromptRoutes from './routes/prompt'
import ProposalRoutes from './routes/proposal'
import CommentRoutes from './routes/comment'
import ReactionRoutes from './routes/reactions'
import ConstantRoutes from './routes/constants'

Route.where('id', Route.matchers.number())

Route.group(() => {
  Route.get('/', async () => {
    return { response: 'welcome!' }
  })

  GenreRoutes()
  UserRoutes()
  PromptRoutes()
  ProposalRoutes()
  CommentRoutes()
  ReactionRoutes()
  ConstantRoutes()
  Route.post('/auth/loguin', 'AuthController.loguin')
}).prefix(Env.get('BASE_ROUTE_PREFIX'))

Route.get('/restart-password/:token', 'UsersController.restartPasswordView')
