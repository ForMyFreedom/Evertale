// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import DefaultController from './DefaultController'
import ThematicWord from 'App/Models/ThematicWord'

export default class ThematicWordsController extends DefaultController {
  protected getModel(): LucidModel {
    return ThematicWord
  }
}
