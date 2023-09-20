import { BaseHTTPService } from "./BaseHTTPService"
import { CommentReactionEntity, CommentEntity, CommentReactionInsert, ReactionType, UserEntity, getExibitionReaction, reactionIsConclusive } from '../entities'
import { CommentRepository, ExceptionHandler, ReactCommentRepository } from '../contracts'
import { ReactCommentsUsecase } from '../usecases'

export class ReactCommentsService extends BaseHTTPService implements ReactCommentsUsecase {
  constructor(
    private readonly reactCommentRepository: ReactCommentRepository,
    private readonly commentRepository: CommentRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async show(commentId: CommentEntity['id']): Promise<void> {
    const comment = await this.commentRepository.find(commentId)
    
    if (!comment) {
      return this.exceptionHandler.UndefinedId()
    }

    const bruteReactions =
      await this.reactCommentRepository.getBruteReactions(commentId)

    const reactions = getExibitionReaction(bruteReactions)
    this.exceptionHandler.SucessfullyRecovered(reactions)
  }

  public async store(userId: UserEntity['id']|undefined, body: CommentReactionInsert): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.InvalidUser()
    }

    const type = ReactionType[body.type] as unknown as ReactionType // @enum shit...

    const comment = await this.commentRepository.find(body.commentId)
    if (!comment) {
      return this.exceptionHandler.NotFound()
    }

    if (comment.authorId == userId) {
      return this.exceptionHandler.CantReactYourself()
    }

    if (reactionIsConclusive(type)) {
      return this.exceptionHandler.CantUseConclusiveReactionInComment()
    }

    const couldFind = await this.reactCommentRepository.getCertainReaction(
      userId, body.commentId
    )

    if (couldFind) {
      await this.reactCommentRepository.delete(couldFind.id)
    }

    const reaction = await this.reactCommentRepository.create(
      { ...body, type: type, userId: userId }
    )

    this.exceptionHandler.SucessfullyCreated(reaction)
  }

  public async destroy(userId: UserEntity['id']|undefined, reactCommentId: CommentReactionEntity['id']): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const reaction = await this.reactCommentRepository.find(reactCommentId)
    if (reaction) {
      if (userId === reaction.userId) {
        await this.reactCommentRepository.delete(reactCommentId)
        this.exceptionHandler.SucessfullyDestroyed(reaction)
      } else {
        this.exceptionHandler.CantDeleteOthersReaction()
      }
    } else {
      this.exceptionHandler.UndefinedId()
    }
  }
}
