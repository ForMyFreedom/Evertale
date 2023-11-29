
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiResponse, englishExceptionContract } from '@ioc:forfabledomain'
import Env from '@ioc:Adonis/Core/Env'
import { ExceptionContract, ResponseHandler } from '@ioc:forfabledomain'

type ErrorTreater = { response: object; errorTreater: (body: any) => void }
type ErrorHandlers = { [key: string]: (error: any) => ErrorTreater }

const contractsList: {[key: string]: ExceptionContract} = {
  'en': englishExceptionContract
}

export default class AdonisResponseHandler extends HttpExceptionHandler implements ResponseHandler {
  public static contract: ExceptionContract = contractsList[Env.get('I18N')]
  public response: ResponseContract
  
  constructor() {
    super(Logger)
  }

  static getInstance(response: ResponseContract): AdonisResponseHandler {
    const instance = new AdonisResponseHandler()
    instance.response = response
    return instance
  }

  private basicHandlers: ErrorHandlers = {
    E_ROUTE_NOT_FOUND: (_error) => ({
      response: { state: 'Failure', error: AdonisResponseHandler.contract.RouteNotFounded },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_ROW_NOT_FOUND: (_error) => ({
      response: { state: 'Failure', error: AdonisResponseHandler.contract.NotFound },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_VALIDATION_FAILURE: (error) => ({
      response: { state: 'Failure', error: error },
      errorTreater: this.response.unprocessableEntity.bind(this.response),
    }),
    E_AUTHORIZATION_FAILURE: (_error) => ({
      response: { state: 'Failure', error: AdonisResponseHandler.contract.Unauthorized },
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

  private Error<T>(error: keyof ExceptionContract|object): ApiResponse<T>{
    return { state: 'Failure', error: error }
  }

  private Sucess<T>(body: T|null|undefined): ApiResponse<T> {
    return body ? { state: 'Sucess', data: body } : { state: 'Failure', error: 'InternalServerError' }
  }

  public SucessfullyCreated<T>(body?: T|null): ApiResponse<T> {
    this.response.created({ state: 'Sucess', message: AdonisResponseHandler.contract.SucessfullyCreated, data: body })
    return this.Sucess(body)
  }

  public SuccessfullyAuthenticated<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ state: 'Sucess', message: AdonisResponseHandler.contract.SuccessfullyAuthenticated, data: body })
    return this.Sucess(body)
  }

  public SucessfullyUpdated<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ state: 'Sucess', message: AdonisResponseHandler.contract.SucessfullyUpdated, data: body })
    return this.Sucess(body)
  }

  public SucessfullyRecovered<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ state: 'Sucess', message: AdonisResponseHandler.contract.SucessfullyRecovered, data: body })
    return this.Sucess(body)
  }

  public SucessfullyDestroyed<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ state: 'Sucess', message: AdonisResponseHandler.contract.SucessfullyDestroyed, data: body })
    return this.Sucess(body)
  }

  public InternalServerError<T>(body?: T|null): ApiResponse<T> {
    this.response.internalServerError({ state: 'Failure', error: AdonisResponseHandler.contract.InternalServerError, data: body })
    return this.Error({ error: 'InternalServerError' })
  }

  public UndefinedId<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.UndefinedId })
    return this.Error({ error: 'UndefinedId' })
  }

  public UndefinedWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.UndefinedWrite })
    return this.Error({ error: 'UndefinedWrite' })
  }

  public UndefinedComment<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.UndefinedComment })
    return this.Error({ error: 'UndefinedComment' })
  }

  public CantDeleteOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.CantDeleteOthersWrite })
    return this.Error({ error: 'CantDeleteOthersWrite' })
  }

  public CantEditOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.CantEditOthersWrite })
    return this.Error({ error: 'CantEditOthersWrite' })
  }

  public CantEditOtherUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.CantEditOtherUser })
    return this.Error({ error: 'CantEditOtherUser' })
  }

  public CantDeleteOtherUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.CantDeleteOtherUser })
    return this.Error({ error: 'CantDeleteOtherUser' })
  }

  public CantDeleteOthersReaction<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.CantDeleteOthersReaction })
    return this.Error({ error: 'CantDeleteOthersReaction' })
  }

  public ImageError<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.ImageError })
    return this.Error({ error: 'ImageError' })
  }

  public Unauthenticated<T>(_body?: T|null): ApiResponse<T> {
    this.response.proxyAuthenticationRequired({ state: 'Failure', error: AdonisResponseHandler.contract.Unauthenticated })
    return this.Error({ error: 'Unauthenticated' })
  }

  public Unauthorized<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.Unauthorized })
    return this.Error({ error: 'Unauthorized' })
  }

  public InvalidUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.InvalidUser })
    return this.Error({ error: 'InvalidUser' })
  }

  public InvalidGenre<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.InvalidGenre })
    return this.Error({ error: 'InvalidGenre' })
  }

  public FileNotFound<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.FileNotFound })
    return this.Error({ error: 'FileNotFound' })
  }

  public CantProposeToClosedHistory<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantProposeToClosedHistory })
    return this.Error({ error: 'CantProposeToClosedHistory' })
  }

  public IncompatibleWriteAndAnswer<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.IncompatibleWriteAndAnswer })
    return this.Error({ error: 'IncompatibleWriteAndAnswer' })
  }

  public CantUseConclusiveReactionInComment<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantUseConclusiveReactionInComment })
    return this.Error({ error: 'CantUseConclusiveReactionInComment' })
  }

  public CantUseConclusiveReactionInPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantUseConclusiveReactionInPrompt })
    return this.Error({ error: 'CantUseConclusiveReactionInPrompt' })
  }

  public TextLengthHigherThanAllowed<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.TextLengthHigherThanAllowed })
    return this.Error({ error: 'TextLengthHigherThanAllowed' })
  }

  public CantUseConclusiveReactionInConcludedHistory<T>(_body?: T|null): ApiResponse<T> {
    this.response.badGateway({ state: 'Failure', error: AdonisResponseHandler.contract.CantUseConclusiveReactionInConcludedHistory })
    return this.Error({ error: 'CantUseConclusiveReactionInConcludedHistory' })
  }

  public NotAppropriablePrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.NotAppropriablePrompt })
    return this.Error({ error: 'NotAppropriablePrompt' })
  }

  public TextDontRespectPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.TextDontRespectPrompt })
    return this.Error({ error: 'TextDontRespectPrompt' })
  }

  public CantEditDailyPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantEditDailyPrompt })
    return this.Error({ error: 'CantEditDailyPrompt' })
  }

  public CantProposeToUnappropriatedPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantProposeToUnappropriatedPrompt })
    return this.Error({ error: 'CantProposeToUnappropriatedPrompt' })
  }

  public ServerMisconfigured<T>(_body?: T|null): ApiResponse<T> {
    this.response.internalServerError({ state: 'Failure', error: AdonisResponseHandler.contract.ServerMisconfigured })
    return this.Error({ error: 'ServerMisconfigured' })
  }

  public CantReactYourself<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.CantReactYourself })
    return this.Error({ error: 'CantReactYourself' })
  }

  public BadRequest<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.BadRequest })
    return this.Error({ error: 'BadRequest' })
  }

  public EmailSended<T>(_body?: T|null): ApiResponse<T> {
    this.response.ok({ message: AdonisResponseHandler.contract.EmailSended })
    return this.Error({ error: 'EmailSended' })
  }

  public CantComplaintToDailyWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.CantComplaintToDailyWrite })
    return this.Error({ error: 'CantComplaintToDailyWrite' })
  }

  public RouteNotFounded<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.NotFound })
    return this.Error({ error: 'RouteNotFounded' })
  }

  public BodyValidationFailure<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.BodyValidationFailure })
    return this.Error({ error: 'BodyValidationFailure' })
  }

  public NotFound<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ state: 'Failure', error: AdonisResponseHandler.contract.NotFound })
    return this.Error({ error: 'NotFound' })
  }

  public UndefinedToken<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.UndefinedToken })
    return this.Error({ error: 'UndefinedToken' })
  }

  public PasswordsDontMatch<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.PasswordsDontMatch })
    return this.Error({ error: 'PasswordsDontMatch' })
  }

  public TokenIsInvalid<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ state: 'Failure', error: AdonisResponseHandler.contract.TokenIsInvalid })
    return this.Error({ error: 'TokenIsInvalid' })
  }

  public PasswordRequired<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.PasswordRequired })
    return this.Error({ error: 'PasswordRequired' })
  }

  public PasswordRegex<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.PasswordRegex })
    return this.Error({ error: 'PasswordRegex' })
  }

  public ImageToLarge<T>(_body?: T | null): ApiResponse<T> {
    this.response.badRequest({ state: 'Failure', error: AdonisResponseHandler.contract.ImageToLarge })
    return this.Error({ error: 'ImageToLarge' })
  }
}
