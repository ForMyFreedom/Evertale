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

type MyError = { error: string }
type ErrorHandler = { [key: string]: (error: any) => MyError }

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  private basicHandlers: ErrorHandler = {
    E_ROUTE_NOT_FOUND: (_error) => ({ error: 'Route not found' }),
    E_VALIDATION_FAILURE: (error) => ({ error: 'Route not found', failures: error.messages }),
  }

  public async handle(error: any, { response }: HttpContextContract): Promise<any> {
    if (error && error.code) {
      const basicResponse = this.basicHandlers[error.code]
      if (basicResponse) {
        response.badRequest(basicResponse(error))
      } else {
        response.badRequest(error)
      }
    }
  }

  public static SucessfullyCreated(response: ResponseContract, body: any): void {
    response.created({ message: 'Sucessfully created', data: body })
  }

  public static SuccessfullyAuthenticated(response: ResponseContract): void {
    response.accepted({ message: 'Successfully authenticated' })
  }

  public static SucessfullyUpdated(response: ResponseContract, body: any): void {
    response.accepted({ message: 'Sucesfully updated', data: body })
  }

  public static SucessfullyRecovered(response: ResponseContract, body: any): void {
    response.accepted({ message: 'Sucessfully recovered', data: body })
  }

  public static SucessfullyDestroyed(response: ResponseContract, body: any): void {
    response.accepted({ message: 'Sucessfully destroyed', data: body })
  }

  public static UndefinedId(response: ResponseContract): void {
    response.notFound({ error: 'Id not Defined' })
  }

  public static UndefinedWrite(response: ResponseContract): void {
    response.notFound({ error: 'Write not Defined' })
  }

  public static UndefinedComment(response: ResponseContract): void {
    response.notFound({ error: 'Comment not Defined' })
  }

  public static CantDeleteOthersWrite(response: ResponseContract): void {
    response.badRequest({ error: "You can't delete others write!" })
  }

  public static CantEditOthersWrite(response: ResponseContract): void {
    response.badRequest({ error: "You can't edit others write!" })
  }

  public static ImageError(response: ResponseContract): void {
    response.badRequest({ error: 'Image error' })
  }

  public static InvalidAuth(response: ResponseContract): void {
    response.unauthorized({ error: 'Invalid Auth' })
  }

  public static InvalidUser(response: ResponseContract): void {
    response.badRequest({ message: 'There is no user with that userId' })
  }

  public static InvalidGenre(response: ResponseContract): void {
    response.badRequest({ message: 'There is no genre with that genreId' })
  }

  public static FileNotFound(response: ResponseContract): void {
    response.notFound({ error: 'File not found' })
  }

  public static CantProposeToClosedHistory(response: ResponseContract): void {
    response.badRequest({ error: "Can't propose to closed fable" })
  }

  public static IncompatibleWriteAndAnswer(response: ResponseContract): void {
    response.badRequest({ error: 'The comment you want to reply to does not belong to this write' })
  }

  public static CantUseConclusiveReactionInComment(response: ResponseContract): void {
    response.badRequest({ error: "Can't use conclusive reaction in comment" })
  }
}
