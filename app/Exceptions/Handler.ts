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

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
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

  public static CantDeleteOthersPrompt(response: ResponseContract): void {
    response.badRequest({ error: "You can't delete others prompt!" })
  }

  public static CantEditOthersPrompt(response: ResponseContract): void {
    response.badRequest({ error: "You can't edit others prompt!" })
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

  public static FileNotFound(response: ResponseContract): void {
    response.notFound({ error: 'File not found' })
  }
}
