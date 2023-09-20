import { BaseHTTPService } from './BaseHTTPService'
import { WriteRepository, ExceptionHandler, CommentRepository } from '../contracts'
import { WriteEntity, UserEntity, CommentEntity, CommentInsert } from '../entities'
import { CommentsUsecase } from '../usecases'

export class CommentsService extends BaseHTTPService implements CommentsUsecase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly writeRepository: WriteRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async indexByWrite(writeId: WriteEntity['id']): Promise<void> {
    if (! await this.writeRepository.find(writeId)) {
      return this.exceptionHandler.NotFound()
    }
    let comments: CommentEntity[] = await this.commentRepository.getByWrite(writeId)
    let authors: UserEntity[] = await this.commentRepository.loadAuthors(comments)
    let finalComments: Partial<CommentEntity>[] = await estruturateCommentsWithAnswers(comments)
    this.exceptionHandler.SucessfullyRecovered({ comments: finalComments, authors: authors })
  }


  public async store(body: CommentInsert): Promise<void> {
    if(! await this.writeRepository.find(body.writeId)) {
      return this.exceptionHandler.UndefinedWrite()
    }

    if (body.answerToId) {
      const toAnswer = await this.commentRepository.find(body.answerToId)
      if(!toAnswer){
        return this.exceptionHandler.UndefinedComment()
      }

      if(toAnswer.writeId !== body.writeId) {
        return this.exceptionHandler.IncompatibleWriteAndAnswer()
      }
    }

    const comment = await this.commentRepository.create(body)
    return this.exceptionHandler.SucessfullyCreated(comment)
  }


  public async update(userId: UserEntity['id']|undefined, commentId: CommentEntity['id'], body: Partial<CommentInsert>): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const comment = await this.commentRepository.find(commentId)
    const { writeId, answerToId, ...safeBody } = body

    if (!comment) {
      return this.exceptionHandler.UndefinedId()
    }

    if (comment.authorId !== userId) {
      return this.exceptionHandler.CantEditOthersWrite()
    }

    const updatedComment = await this.commentRepository.update(commentId, {... safeBody, edited: true})
    this.exceptionHandler.SucessfullyUpdated(updatedComment)
  }


  public async destroy(userId: UserEntity['id']|undefined, commentId: CommentEntity['id']): Promise<void> {
    if (!userId) {
      return this.exceptionHandler.Unauthenticated()
    }

    const comment = await this.commentRepository.find(commentId)

    if (!comment) {
      return this.exceptionHandler.UndefinedId()
    }

    if (comment.authorId !== userId) {
      return this.exceptionHandler.CantDeleteOthersWrite()
    }

    const deletedComment = await this.commentRepository.delete(commentId)
    this.exceptionHandler.SucessfullyDestroyed(deletedComment)
  }
}



async function estruturateCommentsWithAnswers(
  commentsArray: CommentEntity[]
): Promise<Partial<CommentEntity>[]> {
  const newCommentsArray: Partial<CommentEntity>[] = []
  for (const comment of commentsArray) {
    const answerToId = comment.answerToId
    if (answerToId) {
      const originComment = commentsArray.find((c) => c.id === answerToId)
      if (originComment) {
        await insertCommentInTree(comment, originComment)
      }
    } else {
      newCommentsArray.push(comment)
    }
  }
  return newCommentsArray
}


async function insertCommentInTree(comment: CommentEntity, originComment: CommentEntity) {
  let wasBlank = false
  const originCommentAnswers = await originComment.getAnswers()
  if (originCommentAnswers === undefined) {
    wasBlank = true
  }
  if (wasBlank) {
    while (originCommentAnswers.length > 0) {
      originCommentAnswers.pop()
    }
  }
  originCommentAnswers.push(comment)
}
