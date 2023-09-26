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
      return this.exceptionHandler.UndefinedId()
    }
    let comments: CommentEntity[] = await this.commentRepository.getByWrite(writeId)
    let authors: UserEntity[] = await this.commentRepository.loadAuthors(comments)
    let finalComments: Partial<CommentEntity>[] = await estruturateCommentsWithAnswers(comments)
    this.exceptionHandler.SucessfullyRecovered({ comments: finalComments, authors: authors })
  }


  public async store(user: UserEntity|undefined, body: CommentInsert): Promise<void> {
    if (!user) {
      return this.exceptionHandler.Unauthenticated()
    }

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

    const comment = await this.commentRepository.create({
      ...body, authorId: user.id
    })
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
  commentsArray: (CommentEntity & {answers?: CommentEntity[]})[]
): Promise<(Partial<CommentEntity> & {answers?: CommentEntity[]})[]> {
  commentsArray.sort((a, b) => a.id - b.id)
  const newCommentsArray: (CommentEntity & {answers?: CommentEntity[]})[] = []
  for (const comment of commentsArray) {
    const answerToId = comment.answerToId
    if (answerToId) {
      const commentOwner = commentsArray.find((c) => c.id == answerToId)
      if (commentOwner) {
        if(!commentOwner.answers){
          commentOwner.answers = []
        }
        commentOwner.answers.push(comment)
      }
    } else {
      newCommentsArray.push(comment)
    }
  }
  return newCommentsArray
}

