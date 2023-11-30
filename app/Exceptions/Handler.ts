
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiResponse, ExceptionContract, FailureApiResponse, ResponseHandler } from '@ioc:forfabledomain'

type ErrorTreater = { response: FailureApiResponse; errorTreater: (body: any) => void }
type ErrorHandlers = { [key: string]: (error: any) => ErrorTreater }

/* // DEPRECATED
const contractsList: {[key: string]: ExceptionContract} = {
  'en': englishExceptionContract
}
*/

export default class AdonisResponseHandler extends HttpExceptionHandler implements ResponseHandler {
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
      response: { state: 'Failure', error: 'RouteNotFounded' },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_ROW_NOT_FOUND: (_error) => ({
      response: { state: 'Failure', error: 'NotFound' },
      errorTreater: this.response.badRequest.bind(this.response),
    }),
    E_VALIDATION_FAILURE: (error) => ({
      response: { state: 'Failure', error: 'BodyValidationFailure', data: error.messages },
      errorTreater: this.response.unprocessableEntity.bind(this.response),
    }),
    E_AUTHORIZATION_FAILURE: (_error) => ({
      response: { state: 'Failure', error: 'Unauthorized' },
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

  private Error<T>(error: keyof ExceptionContract, data?: T|null): ApiResponse<T> {
    return { state: 'Failure', error: error, data: data }
  }

  private Sucess<T>(message: keyof ExceptionContract, body: T|null|undefined): ApiResponse<T> {
    return body ? { state: 'Sucess', message: message, data: body } : { state:'Failure', error: 'InternalServerError' }
  }

  public SucessfullyCreated<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('SucessfullyCreated', body)
    this.response.created(responseObject)
    return responseObject
  }

  public SuccessfullyAuthenticated<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('SuccessfullyAuthenticated', body)
    this.response.accepted(responseObject)
    return responseObject
  }

  public SucessfullyUpdated<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('SucessfullyUpdated', body)
    this.response.accepted(responseObject)
    return responseObject
  }

  public SucessfullyRecovered<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('SucessfullyRecovered', body)
    this.response.accepted(responseObject)
    return responseObject
  }

  public SucessfullyDestroyed<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('SucessfullyDestroyed', body)
    this.response.accepted(responseObject)
    return responseObject
  }

  public InternalServerError<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('InternalServerError', body)
    this.response.internalServerError(responseObject)
    return responseObject
  }

  public UndefinedId<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('UndefinedId')
    this.response.notFound(responseObject)
    return responseObject
  }

  public UndefinedWrite<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('UndefinedWrite')
    this.response.notFound(responseObject)
    return responseObject
  }

  public UndefinedComment<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('UndefinedComment')
    this.response.notFound(responseObject)
    return responseObject
  }

  public CantDeleteOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantDeleteOthersWrite')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public CantEditOthersWrite<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantEditOthersWrite')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public CantEditOtherUser<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantEditOtherUser')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public CantDeleteOtherUser<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantDeleteOtherUser')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public CantDeleteOthersReaction<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantDeleteOthersReaction')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public ImageError<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('ImageError')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public Unauthenticated<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('Unauthenticated')
    this.response.proxyAuthenticationRequired(responseObject)
    return responseObject
  }

  public Unauthorized<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('Unauthorized')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public InvalidUser<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('InvalidUser')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public InvalidGenre<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('InvalidGenre')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public FileNotFound<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('FileNotFound')
    this.response.notFound(responseObject)
    return responseObject
  }

  public CantProposeToClosedHistory<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantProposeToClosedHistory')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public IncompatibleWriteAndAnswer<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('IncompatibleWriteAndAnswer')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public CantUseConclusiveReactionInComment<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantUseConclusiveReactionInComment')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public CantUseConclusiveReactionInPrompt<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantUseConclusiveReactionInPrompt')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public TextLengthHigherThanAllowed<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('TextLengthHigherThanAllowed')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public CantUseConclusiveReactionInConcludedHistory<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantUseConclusiveReactionInConcludedHistory')
    this.response.badGateway(responseObject)
    return responseObject
  }

  public NotAppropriablePrompt<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('NotAppropriablePrompt')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public TextDontRespectPrompt<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('TextDontRespectPrompt')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public CantEditDailyPrompt<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantEditDailyPrompt')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public CantProposeToUnappropriatedPrompt<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantProposeToUnappropriatedPrompt')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public ServerMisconfigured<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('ServerMisconfigured')
    this.response.internalServerError(responseObject)
    return responseObject
  }

  public CantReactYourself<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantReactYourself')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public BadRequest<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('BadRequest')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public EmailSended<T>(body?: T|null): ApiResponse<T> {
    const responseObject = this.Sucess<T>('EmailSended', body)
    this.response.ok(responseObject)
    return responseObject
  }

  public CantComplaintToDailyWrite<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('CantComplaintToDailyWrite')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public RouteNotFounded<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('RouteNotFounded')
    this.response.notFound(responseObject)
    return responseObject
  }

  public BodyValidationFailure<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('BodyValidationFailure')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public NotFound<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('NotFound')
    this.response.notFound(responseObject)
    return responseObject
  }

  public UndefinedToken<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('UndefinedToken')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public PasswordsDontMatch<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('PasswordsDontMatch')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public TokenIsInvalid<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('TokenIsInvalid')
    this.response.unauthorized(responseObject)
    return responseObject
  }

  public PasswordRequired<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('PasswordRequired')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public PasswordRegex<T>(_body?: T|null): ApiResponse<T> {
    const responseObject = this.Error<T>('PasswordRegex')
    this.response.badRequest(responseObject)
    return responseObject
  }

  public ImageToLarge<T>(_body?: T | null): ApiResponse<T> {
    const responseObject = this.Error<T>('ImageToLarge')
    this.response.badRequest(responseObject)
    return responseObject
  }
}
