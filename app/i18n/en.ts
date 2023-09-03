import { ExceptionContract } from "./exceptions"


const englishExceptionContract: ExceptionContract = {
    RouteNotFounded: 'Route not found',
    BodyValidationFailure: 'Validation failure',
    Unauthorized: 'Unauthorized',
    Unauthenticated: 'Invalid Auth',
    SucessfullyCreated: 'Sucessfully created',
    SuccessfullyAuthenticated: 'Successfully authenticated',
    SucessfullyUpdated: 'Sucesfully updated',
    SucessfullyRecovered: 'Sucesfully recovered',
    SucessfullyDestroyed: 'Sucessfully destroyed',
    UndefinedId: 'Id not Defined',
    UndefinedWrite: 'Write not Defined',
    UndefinedComment: 'Comment not Defined',
    CantDeleteOthersWrite: "You can't delete others write!",
    CantEditOthersWrite: "You can't edit others write!",
    CantEditOtherUser: "You can't edit others users!",
    CantDeleteOtherUser: "You can't delete others reaction!",
    CantDeleteOthersReaction: "You can't delete others reaction!",
    ImageError: 'Image error',
    InvalidUser: 'There is no genre with that genreId',
    InvalidGenre: 'There is no genre with that genreId',
    FileNotFound: 'File not found',
    NotFound: 'Something was not found',
    CantProposeToClosedHistory: "Can't propose to closed fable",
    IncompatibleWriteAndAnswer: 'The comment you want to reply to does not belong to this write',
    CantUseConclusiveReactionInComment: "Can't use conclusive reaction in comment",
    CantUseConclusiveReactionInPrompt: "Can't use conclusive reaction in prompt"
}

export default englishExceptionContract