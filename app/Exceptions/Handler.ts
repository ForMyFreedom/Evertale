/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ExceptionContract } from 'App/i18n/exceptions'
import englishExceptionContract from 'App/i18n/en'
import Env from '@ioc:Adonis/Core/Env'

type ErrorTreater = { response: object; errorTreater: (body: any) => void }
type ErrorHandlers = { [key: string]: (error: any, response: ResponseContract) => ErrorTreater }

const contractsList: {[key: string]: ExceptionContract} = {
  'en': englishExceptionContract
}

export default class ExceptionHandler extends HttpExceptionHandler {
  public static contract: ExceptionContract = contractsList[Env.get('I18N')]
  
  constructor() {
    super(Logger)
  }

  private basicHandlers: ErrorHandlers = {
    E_ROUTE_NOT_FOUND: (_error, r) => ({
      response: { error: ExceptionHandler.contract.RouteNotFounded },
      errorTreater: r.badRequest.bind(r),
    }),
    E_ROW_NOT_FOUND: (_error, r) => ({
      response: { error: ExceptionHandler.contract.NotFound },
      errorTreater: r.badRequest.bind(r),
    }),
    E_VALIDATION_FAILURE: (error, r) => ({
      response: { error: ExceptionHandler.contract.BodyValidationFailure, failures: error.messages },
      errorTreater: r.badRequest.bind(r),
    }),
    E_AUTHORIZATION_FAILURE: (_error, r) => ({
      response: { error: ExceptionHandler.contract.Unauthorized },
      errorTreater: r.unauthorized.bind(r),
    }),
  }

  public async handle(error: any, { response }: HttpContextContract): Promise<any> {
    if (error && error.code) {
      const basicResponse = this.basicHandlers[error.code]
      if (basicResponse) {
        const responseHandler = basicResponse(error, response)
        responseHandler.errorTreater(responseHandler.response)
      } else {
        response.badRequest(error)
      }
    }
  }

  public static SucessfullyCreated(response: ResponseContract, body: any): void {
    response.created({ message: this.contract.SucessfullyCreated, data: body })
  }

  public static SuccessfullyAuthenticated(response: ResponseContract): void {
    response.accepted({ message: this.contract.SuccessfullyAuthenticated })
  }

  public static SucessfullyUpdated(response: ResponseContract, body: any): void {
    response.accepted({ message: this.contract.SucessfullyUpdated, data: body })
  }

  public static SucessfullyRecovered(response: ResponseContract, body: any): void {
    response.accepted({ message: this.contract.SucessfullyRecovered, data: body })
  }

  public static SucessfullyDestroyed(response: ResponseContract, body: any): void {
    response.accepted({ message: this.contract.SucessfullyDestroyed, data: body })
  }

  public static UndefinedId(response: ResponseContract): void {
    response.notFound({ error: this.contract.UndefinedId })
  }

  public static UndefinedWrite(response: ResponseContract): void {
    response.notFound({ error: this.contract.UndefinedWrite })
  }

  public static UndefinedComment(response: ResponseContract): void {
    response.notFound({ error: this.contract.UndefinedComment })
  }

  public static CantDeleteOthersWrite(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.CantDeleteOthersWrite })
  }

  public static CantEditOthersWrite(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.CantEditOthersWrite })
  }

  public static CantEditOtherUser(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.CantEditOtherUser })
  }

  public static CantDeleteOtherUser(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.CantDeleteOtherUser })
  }

  public static CantDeleteOthersReaction(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.CantDeleteOthersReaction })
  }

  public static ImageError(response: ResponseContract): void {
    response.badRequest({ error: this.contract.ImageError })
  }

  public static Unauthenticated(response: ResponseContract): void {
    response.proxyAuthenticationRequired({ error: this.contract.Unauthenticated })
  }

  public static Unauthorized(response: ResponseContract): void {
    response.unauthorized({ error: this.contract.Unauthorized })
  }

  public static InvalidUser(response: ResponseContract): void {
    response.badRequest({ message: this.contract.InvalidUser })
  }

  public static InvalidGenre(response: ResponseContract): void {
    response.badRequest({ message: this.contract.InvalidGenre })
  }

  public static FileNotFound(response: ResponseContract): void {
    response.notFound({ error: this.contract.FileNotFound })
  }

  public static CantProposeToClosedHistory(response: ResponseContract): void {
    response.badRequest({ error: this.contract.CantProposeToClosedHistory })
  }

  public static IncompatibleWriteAndAnswer(response: ResponseContract): void {
    response.badRequest({ error: this.contract.IncompatibleWriteAndAnswer })
  }

  public static CantUseConclusiveReactionInComment(response: ResponseContract): void {
    response.badRequest({ error: this.contract.CantUseConclusiveReactionInComment })
  }

  public static CantUseConclusiveReactionInPrompt(response: ResponseContract): void {
    response.badRequest({ error: this.contract.CantUseConclusiveReactionInPrompt })
  }

  public static TextLengthHigherThanAllowed(response: ResponseContract): void {
    response.badRequest({ error: 'Text length higher than allowed' })
  }

  public static CantUseConclusiveReactionInConcludedHistory(response: ResponseContract): void {
    response.badGateway({ error: "Can't use conclusive reaction in concluded history" })
  }

  public static NotAppropriablePrompt(response: ResponseContract): void {
    response.badRequest({ error: 'This is not an appropriable prompt!' })
  }

  public static TextDontRespectPrompt(response: ResponseContract): void {
    response.badRequest({ error: "Your text don't respect prompt" })
  }

  public static CantEditDailyPrompt(response: ResponseContract): void {
    response.badRequest({ error: "Can't edit a daily prompt!" })
  }

  public static CantProposeToUnappropriatedPrompt(response: ResponseContract): void {
    response.badRequest({ error: "Can't proposoe to unappropriated prompt" })
  }
}
