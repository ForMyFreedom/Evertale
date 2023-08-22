import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Comment from 'App/Models/Comment'
import { CommentReaction } from 'App/Models/Reaction'
import { cleanReactions, reactionIsConclusive } from 'App/Utils/reactions'
import CommentReactionValidator from 'App/Validators/CommentReactionValidator'

export default class ReactCommentsController {
  public async show({ response, params }: HttpContextContract): Promise<void> {
    if (await Comment.find(params.id)) {
      const bruteReactions = await CommentReaction.query()
        .where('commentId', '=', params.id)
        .select('type')
        .countDistinct('id as id')
        .count('* as total')
        .groupBy('type')

      const reactions = cleanReactions(bruteReactions)
      ExceptionHandler.SucessfullyRecovered(response, reactions)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const authorId = auth?.user?.id
    if (authorId) {
      const body = await new CommentReactionValidator(ctx).validate()

      if (reactionIsConclusive(body.type)) {
        return ExceptionHandler.CantUseConclusiveReactionInComment(response)
      }

      const couldFind = await CommentReaction.query()
        .where('userId', '=', authorId)
        .where('commentId', '=', body.commentId)

      if (couldFind.length > 0) {
        couldFind[0].delete()
      }
      const reaction = await CommentReaction.create({ ...body, userId: authorId })
      reaction.save()
      ExceptionHandler.SucessfullyCreated(response, reaction)
    } else {
      ExceptionHandler.InvalidUser(response)
    }
  }

  public async destroy({ response, params }: HttpContextContract): Promise<void> {
    const reaction = await CommentReaction.find(params.id)
    if (reaction) {
      await reaction.delete()
      ExceptionHandler.SucessfullyDestroyed(response, reaction)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}
