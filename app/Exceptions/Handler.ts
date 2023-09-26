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
import { englishExceptionContract } from '@ioc:forfabledomain'
import Env from '@ioc:Adonis/Core/Env'
import { ExceptionContract, ExceptionHandler } from '@ioc:forfabledomain'

type ErrorTreater = { response: object; errorTreater: (body: any) => void }
type ErrorHandlers = { [key: string]: (error: any, ) => ErrorTreater }

const contractsList: {[key: string]: ExceptionContract} = {
  'en': englishExceptionContract
}

export default class AdonisExceptionHandler extends HttpExceptionHandler implements ExceptionHandler {
  public static contract: ExceptionContract = contractsList[Env.get('I18N')]
  public response: ResponseContract
  
  constructor() {
    super(Logger)
  }

  static getInstance(response: ResponseContract): AdonisExceptionHandler {
    const instance = new AdonisExceptionHandler()
    instance.response = response
    return instance
  }

  private basicHandlers: ErrorHandlers = {
    E_ROUTE_NOT_FOUND: (_error) => ({
      response: { error: AdonisExceptionHandler.contract.RouteNotFounded },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_ROW_NOT_FOUND: (_error) => ({
      response: { error: AdonisExceptionHandler.contract.NotFound },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_VALIDATION_FAILURE: (error) => ({
      response: { error: AdonisExceptionHandler.contract.BodyValidationFailure, failures: error.messages },
      errorTreater: this.response.unprocessableEntity.bind(this.response),
    }),
    E_AUTHORIZATION_FAILURE: (_error) => ({
      response: { error: AdonisExceptionHandler.contract.Unauthorized },
      errorTreater: this.response.unauthorized.bind(this.response),
    }),
  }

  public async handle(error: any, { response }: HttpContextContract): Promise<any> {
    this.response = response
    if (error && error.code) {
      const basicResponse = this.basicHandlers[error.code]
      if (basicResponse) {
        const responseHandler = basicResponse(error)
        responseHandler.errorTreater(responseHandler.response)
      } else {
        response.badRequest()
      }
    }
  }

  public SucessfullyCreated(body: any): void {
    this.response.created({ message: AdonisExceptionHandler.contract.SucessfullyCreated, data: body })
  }

  public SuccessfullyAuthenticated(): void {
    this.response.accepted({ message: AdonisExceptionHandler.contract.SuccessfullyAuthenticated })
  }

  public SucessfullyUpdated(body: any): void {
    this.response.accepted({ message: AdonisExceptionHandler.contract.SucessfullyUpdated, data: body })
  }

  public SucessfullyRecovered(body: any): void {
    this.response.accepted({ message: AdonisExceptionHandler.contract.SucessfullyRecovered, data: body })
  }

  public SucessfullyDestroyed(body: any): void {
    this.response.accepted({ message: AdonisExceptionHandler.contract.SucessfullyDestroyed, data: body })
  }

  public UndefinedId(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.UndefinedId })
  }

  public UndefinedWrite(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.UndefinedWrite })
  }

  public UndefinedComment(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.UndefinedComment })
  }

  public CantDeleteOthersWrite(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.CantDeleteOthersWrite })
  }

  public CantEditOthersWrite(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.CantEditOthersWrite })
  }

  public CantEditOtherUser(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.CantEditOtherUser })
  }

  public CantDeleteOtherUser(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.CantDeleteOtherUser })
  }

  public CantDeleteOthersReaction(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.CantDeleteOthersReaction })
  }

  public ImageError(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.ImageError })
  }

  public Unauthenticated(): void {
    this.response.proxyAuthenticationRequired({ error: AdonisExceptionHandler.contract.Unauthenticated })
  }

  public Unauthorized(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.Unauthorized })
  }

  public InvalidUser(): void {
    this.response.badRequest({ message: AdonisExceptionHandler.contract.InvalidUser })
  }

  public InvalidGenre(): void {
    this.response.badRequest({ message: AdonisExceptionHandler.contract.InvalidGenre })
  }

  public FileNotFound(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.FileNotFound })
  }

  public CantProposeToClosedHistory(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantProposeToClosedHistory })
  }

  public IncompatibleWriteAndAnswer(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.IncompatibleWriteAndAnswer })
  }

  public CantUseConclusiveReactionInComment(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantUseConclusiveReactionInComment })
  }

  public CantUseConclusiveReactionInPrompt(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantUseConclusiveReactionInPrompt })
  }

  public TextLengthHigherThanAllowed(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.TextLengthHigherThanAllowed })
  }

  public CantUseConclusiveReactionInConcludedHistory(): void {
    this.response.badGateway({ error: AdonisExceptionHandler.contract.CantUseConclusiveReactionInConcludedHistory })
  }

  public NotAppropriablePrompt(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.NotAppropriablePrompt })
  }

  public TextDontRespectPrompt(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.TextDontRespectPrompt })
  }

  public CantEditDailyPrompt(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantEditDailyPrompt })
  }

  public CantProposeToUnappropriatedPrompt(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantProposeToUnappropriatedPrompt })
  }

  public ServerMisconfigured(): void {
    this.response.internalServerError({ error: AdonisExceptionHandler.contract.ServerMisconfigured })
  }

  public CantReactYourself(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.CantReactYourself })
  }

  public BadRequest(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.BadRequest })
  }

  public EmailSended(): void {
    this.response.ok({ message: AdonisExceptionHandler.contract.EmailSended })
  }

  public CantComplaintToDailyWrite(): void {
    this.response.badRequest({ message: AdonisExceptionHandler.contract.CantComplaintToDailyWrite })
  }

  public RouteNotFounded(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.NotFound })
  }

  public BodyValidationFailure(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.BodyValidationFailure })
  }

  public NotFound(): void {
    this.response.notFound({ error: AdonisExceptionHandler.contract.NotFound })
  }

  public UndefinedToken(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.UndefinedToken })
  }

  public PasswordsDontMatch(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.PasswordsDontMatch })
  }

  public TokenIsInvalid(): void {
    this.response.unauthorized({ error: AdonisExceptionHandler.contract.TokenIsInvalid })
  }

  public PasswordRequired(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.PasswordRequired })
  }

  public PasswordRegex(): void {
    this.response.badRequest({ error: AdonisExceptionHandler.contract.PasswordRegex })
  }
}
