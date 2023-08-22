import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Comment from 'App/Models/Comment'
import Write from 'App/Models/Write'
import CommentValidator from 'App/Validators/CommentValidator'

export default class CommentsController {
  public async index({ response }: HttpContextContract): Promise<void> {
    const comments = await Comment.all()
    ExceptionHandler.SucessfullyRecovered(response, comments)
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    try {
      const comment = await Comment.findOrFail(params.id)
      await comment.load('author')
      delete comment.$attributes.authorId
      await comment.load('write')
      delete comment.$attributes.writeId
      await comment.load('answers')
      ExceptionHandler.SucessfullyRecovered(response, comment)
    } catch (e) {
      console.log(e)
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
