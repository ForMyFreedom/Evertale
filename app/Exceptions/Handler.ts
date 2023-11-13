
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiResponse, englishExceptionContract } from '@ioc:forfabledomain'
import Env from '@ioc:Adonis/Core/Env'
import { ExceptionContract, ResponseHandler } from '@ioc:forfabledomain'

type ErrorTreater = { response: object; errorTreater: (body: any) => void }
type ErrorHandlers = { [key: string]: (error: any, ) => ErrorTreater }

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
      response: { error: AdonisResponseHandler.contract.RouteNotFounded },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_ROW_NOT_FOUND: (_error) => ({
      response: { error: AdonisResponseHandler.contract.NotFound },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_VALIDATION_FAILURE: (error) => ({
      response: { error: error.messages },
      errorTreater: this.response.unprocessableEntity.bind(this.response),
    }),
    E_AUTHORIZATION_FAILURE: (_error) => ({
      response: { error: AdonisResponseHandler.contract.Unauthorized },
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

  public SucessfullyCreated<T>(body?: T|null): ApiResponse<T> {
    this.response.created({ message: AdonisResponseHandler.contract.SucessfullyCreated, data: body })
    return body ? { data: body } : { error: 'InternalServerError' }
  }

  public SuccessfullyAuthenticated<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ message: AdonisResponseHandler.contract.SuccessfullyAuthenticated, data: body })
    return body ? { data: body } : { error: 'InternalServerError' }
  }

  public InternalServerError<T>(body?: T|null): ApiResponse<T> {
    this.response.internalServerError({ error: AdonisResponseHandler.contract.InternalServerError, data: body })
    return { error: 'InternalServerError' }
  }

  public SucessfullyUpdated<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ message: AdonisResponseHandler.contract.SucessfullyUpdated, data: body })
    return body ? { data: body } : { error: 'InternalServerError' }
  }

  public SucessfullyRecovered<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ message: AdonisResponseHandler.contract.SucessfullyRecovered, data: body })
    return body ? { data: body } : { error: 'InternalServerError' }
  }

  public SucessfullyDestroyed<T>(body?: T|null): ApiResponse<T> {
    this.response.accepted({ message: AdonisResponseHandler.contract.SucessfullyDestroyed, data: body })
    return body ? { data: body } : { error: 'InternalServerError' }
  }

  public UndefinedId<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.UndefinedId })
    return { error: 'UndefinedId' }
  }

  public UndefinedWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.UndefinedWrite })
    return { error: 'UndefinedWrite' }
  }

  public UndefinedComment<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.UndefinedComment })
    return { error: 'UndefinedComment' }
  }

  public CantDeleteOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.CantDeleteOthersWrite })
    return { error: 'CantDeleteOthersWrite' }
  }

  public CantEditOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.CantEditOthersWrite })
    return { error: 'CantEditOthersWrite' }
  }

  public CantEditOtherUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.CantEditOtherUser })
    return { error: 'CantEditOtherUser' }
  }

  public CantDeleteOtherUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.CantDeleteOtherUser })
    return { error: 'CantDeleteOtherUser' }
  }

  public CantDeleteOthersReaction<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.CantDeleteOthersReaction })
    return { error: 'CantDeleteOthersReaction' }
  }

  public ImageError<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.ImageError })
    return { error: 'ImageError' }
  }

  public Unauthenticated<T>(_body?: T|null): ApiResponse<T> {
    this.response.proxyAuthenticationRequired({ error: AdonisResponseHandler.contract.Unauthenticated })
    return { error: 'Unauthenticated' }
  }

  public Unauthorized<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.Unauthorized })
    return { error: 'Unauthorized' }
  }

  public InvalidUser<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.InvalidUser })
    return { error: 'InvalidUser' }
  }

  public InvalidGenre<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.InvalidGenre })
    return { error: 'InvalidGenre' }
  }

  public FileNotFound<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.FileNotFound })
    return { error: 'FileNotFound' }
  }

  public CantProposeToClosedHistory<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantProposeToClosedHistory })
    return { error: 'CantProposeToClosedHistory' }
  }

  public IncompatibleWriteAndAnswer<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.IncompatibleWriteAndAnswer })
    return { error: 'IncompatibleWriteAndAnswer' }
  }

  public CantUseConclusiveReactionInComment<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantUseConclusiveReactionInComment })
    return { error: 'CantUseConclusiveReactionInComment' }
  }

  public CantUseConclusiveReactionInPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantUseConclusiveReactionInPrompt })
    return { error: 'CantUseConclusiveReactionInPrompt' }
  }

  public TextLengthHigherThanAllowed<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.TextLengthHigherThanAllowed })
    return { error: 'TextLengthHigherThanAllowed' }
  }

  public CantUseConclusiveReactionInConcludedHistory<T>(_body?: T|null): ApiResponse<T> {
    this.response.badGateway({ error: AdonisResponseHandler.contract.CantUseConclusiveReactionInConcludedHistory })
    return { error: 'CantUseConclusiveReactionInConcludedHistory' }
  }

  public NotAppropriablePrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.NotAppropriablePrompt })
    return { error: 'NotAppropriablePrompt' }
  }

  public TextDontRespectPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.TextDontRespectPrompt })
    return { error: 'TextDontRespectPrompt' }
  }

  public CantEditDailyPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantEditDailyPrompt })
    return { error: 'CantEditDailyPrompt' }
  }

  public CantProposeToUnappropriatedPrompt<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantProposeToUnappropriatedPrompt })
    return { error: 'CantProposeToUnappropriatedPrompt' }
  }

  public ServerMisconfigured<T>(_body?: T|null): ApiResponse<T> {
    this.response.internalServerError({ error: AdonisResponseHandler.contract.ServerMisconfigured })
    return { error: 'ServerMisconfigured' }
  }

  public CantReactYourself<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.CantReactYourself })
    return { error: 'CantReactYourself' }
  }

  public BadRequest<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.BadRequest })
    return { error: 'BadRequest' }
  }

  public EmailSended<T>(_body?: T|null): ApiResponse<T> {
    this.response.ok({ message: AdonisResponseHandler.contract.EmailSended })
    return { error: 'EmailSended' }
  }

  public CantComplaintToDailyWrite<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ message: AdonisResponseHandler.contract.CantComplaintToDailyWrite })
    return { error: 'CantComplaintToDailyWrite' }
  }

  public RouteNotFounded<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.NotFound })
    return { error: 'RouteNotFounded' }
  }

  public BodyValidationFailure<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.BodyValidationFailure })
    return { error: 'BodyValidationFailure' }
  }

  public NotFound<T>(_body?: T|null): ApiResponse<T> {
    this.response.notFound({ error: AdonisResponseHandler.contract.NotFound })
    return { error: 'NotFound' }
  }

  public UndefinedToken<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.UndefinedToken })
    return { error: 'UndefinedToken' }
  }

  public PasswordsDontMatch<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.PasswordsDontMatch })
    return { error: 'PasswordsDontMatch' }
  }

  public TokenIsInvalid<T>(_body?: T|null): ApiResponse<T> {
    this.response.unauthorized({ error: AdonisResponseHandler.contract.TokenIsInvalid })
    return { error: 'TokenIsInvalid' }
  }

  public PasswordRequired<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.PasswordRequired })
    return { error: 'PasswordRequired' }
  }

  public PasswordRegex<T>(_body?: T|null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.PasswordRegex })
    return { error: 'PasswordRegex' }
  }

  public ImageToLarge<T>(_body?: T | null): ApiResponse<T> {
    this.response.badRequest({ error: AdonisResponseHandler.contract.ImageToLarge })
    return { error: 'ImageToLarge' }
  }
}
