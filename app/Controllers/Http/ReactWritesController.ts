import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Prompt from 'App/Models/Prompt'
import { ReactionType, WriteReaction } from 'App/Models/Reaction'
import Write from 'App/Models/Write'
import { cleanReactions, reactionIsConclusive } from 'App/Utils/reactions'
import WriteReactionValidator from 'App/Validators/WriteReactionValidator'

export default class ReactWritesController {
  public async show({ response, params }: HttpContextContract): Promise<void> {
    if (await Write.find(params.id)) {
      const bruteReactions = await WriteReaction.query()
        .where('writeId', '=', params.id)
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
      const body = await new WriteReactionValidator(ctx).validate()
      const type = ReactionType[body.type] as ReactionType

      if (reactionIsConclusive(type) && (await writeIsPrompt(body.writeId))) {
        return ExceptionHandler.CantUseConclusiveReactionInPrompt(response)
      }

      const couldFind = await WriteReaction.query()
        .where('userId', '=', authorId)
        .where('writeId', '=', body.writeId)

      if (couldFind.length > 0) {
        couldFind[0].delete()
      }
      const reaction = await WriteReaction.create({ ...body, type: type, userId: authorId })
      reaction.save()
      ExceptionHandler.SucessfullyCreated(response, reaction)
    } else {
      ExceptionHandler.InvalidUser(response)
    }
  }

  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const responserId = auth?.user?.id
    if (!responserId) {
      return ExceptionHandler.InvalidAuth(response)
    }
    const reaction = await WriteReaction.find(params.id)
    if (reaction) {
      if (responserId === reaction.userId) {
        await reaction.delete()
        ExceptionHandler.SucessfullyDestroyed(response, reaction)
      } else {
        ExceptionHandler.CantDeleteOthersReaction(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}

async function writeIsPrompt(writeId: number): Promise<boolean> {
  const prompts = await Prompt.query().where('writeId', '=', writeId)
  return prompts.length > 0
}
