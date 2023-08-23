import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Comment from 'App/Models/Comment'
import User from 'App/Models/User'
import Write from 'App/Models/Write'
import CommentValidator from 'App/Validators/CommentValidator'

export default class CommentsController {
  public async indexByWrite({ response, params }: HttpContextContract): Promise<void> {
    if (await Write.find(params.id)) {
      let comments: Comment[] = await Comment.query().where('writeId', '=', params.id)
      let authors: User[] = await loadAuthors(comments)
      let finalComments: Partial<Comment>[] = await estruturateCommentsWithAnswers(comments)
      ExceptionHandler.SucessfullyRecovered(response, { comments: finalComments, authors: authors })
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const body = await new CommentValidator(ctx).validate()
    const authorId = auth?.user?.id
    if (authorId) {
      if (!(await Write.find(body.writeId))) {
        return ExceptionHandler.UndefinedWrite(response)
      }

      if (body.answerToId) {
        const toAnswer = await Comment.find(body.answerToId)
        if (!toAnswer) {
          return ExceptionHandler.UndefinedComment(response)
        }

        if (toAnswer.writeId !== body.writeId) {
          return ExceptionHandler.IncompatibleWriteAndAnswer(response)
        }
      }

      const comment = await Comment.create({ authorId: authorId, ...body })
      ExceptionHandler.SucessfullyCreated(response, comment)
    } else {
      ExceptionHandler.InvalidUser(response)
    }
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response, params, auth } = ctx
    const comment = await Comment.find(params.id)
    const { writeId, answerToId, ...body } = await new CommentValidator(ctx).validateAsOptional()

    if (comment) {
      if (comment.authorId !== auth?.user?.id) {
        ExceptionHandler.CantEditOthersWrite(response)
        return
      }

      comment.merge({ ...body, edited: true })
      await comment.save()

      await comment.load('author')
      ExceptionHandler.SucessfullyUpdated(response, comment)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const comment = await Comment.find(params.id)
    if (comment) {
      if (comment.authorId === auth?.user?.id) {
        await comment.delete()
        ExceptionHandler.SucessfullyDestroyed(response, comment)
      } else {
        ExceptionHandler.CantDeleteOthersWrite(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}

async function loadAuthors(commentsArray: Comment[]): Promise<User[]> {
  const usersArray: User[] = []
  for (const comment of commentsArray) {
    const couldFind = usersArray.find((user) => user.id === comment.authorId)
    if (!couldFind) {
      const user = await User.find(comment.authorId)
      if (user) {
        usersArray.push(user)
      }
    }
  }
  return usersArray
}

async function estruturateCommentsWithAnswers(
  commentsArray: Comment[]
): Promise<Partial<Comment>[]> {
  const newCommentsArray: Partial<Comment>[] = []
  for (const comment of commentsArray) {
    const answerToId = comment.answerToId
    cleanUselessProps(comment)
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

function cleanUselessProps(comment: Comment): void {
  delete comment.$attributes.answerToId
  delete comment.$attributes.writeId
}

async function insertCommentInTree(comment: Comment, originComment: Comment) {
  let wasBlank = false
  if (originComment.answers === undefined) {
    wasBlank = true
    await originComment.load('answers')
  }
  if (wasBlank) {
    while (originComment.answers.length > 0) {
      originComment.answers.pop()
    }
  }
  originComment.answers.push(comment as Comment)
}
