
export interface ExceptionContract {
  RouteNotFounded: string
  BodyValidationFailure: string
  SucessfullyCreated: string
  SuccessfullyAuthenticated: string
  SucessfullyUpdated: string
  SucessfullyRecovered: string
  SucessfullyDestroyed: string
  UndefinedId: string
  UndefinedWrite: string
  UndefinedComment: string
  CantDeleteOthersWrite: string
  CantEditOthersWrite: string
  CantEditOtherUser: string
  CantDeleteOtherUser: string
  CantDeleteOthersReaction: string
  ImageError: string
  Unauthenticated: string
  Unauthorized: string
  InvalidUser: string
  InvalidGenre: string
  FileNotFound: string
  NotFound: string
  CantProposeToClosedHistory: string
  IncompatibleWriteAndAnswer: string
  CantUseConclusiveReactionInComment: string
  CantUseConclusiveReactionInPrompt: string
  ServerMisconfigured: string
  CantProposeToUnappropriatedPrompt: string
  CantEditDailyPrompt: string
  TextDontRespectPrompt: string
  NotAppropriablePrompt: string
  CantUseConclusiveReactionInConcludedHistory: string
  TextLengthHigherThanAllowed: string
  CantReactYourself: string
  UndefinedToken: string
  PasswordsDontMatch: string
  TokenIsInvalid: string
  PasswordRequired: string
  PasswordRegex: string
  BadRequest: string
  EmailSended: string
  CantComplaintToDailyWrite: string
}

export type ExceptionHandler = {
  [Prop in keyof ExceptionContract]: (body?: any) => void
}