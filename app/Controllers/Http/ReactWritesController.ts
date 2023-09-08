import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Prompt from 'App/Models/Prompt'
import Proposal from 'App/Models/Proposal'
import { ReactionType, WriteReaction } from 'App/Models/Reaction'
import Write from 'App/Models/Write'
import { cleanReactions, reactionIsConclusive } from 'App/Utils/reactions'
import { WriteReactionValidator } from 'App/Validators/WriteReactionValidator'

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

      if (await reactItself(body.writeId, authorId)) {
        return ExceptionHandler.CantReactYourself(response)
      }

      if (reactionIsConclusive(type)) {
        if (await writeIsPrompt(body.writeId)) {
          return ExceptionHandler.CantUseConclusiveReactionInPrompt(response)
        } else {
          const proposal = await Proposal.query().where('writeId', '=', body.writeId)
          if (proposal.length > 0) {
            await proposal[0].load('prompt')
            if (proposal[0].prompt.concluded) {
              return ExceptionHandler.CantUseConclusiveReactionInConcludedHistory(response)
            }
          }
        }
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
      return ExceptionHandler.Unauthenticated(response)
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

async function reactItself(writeId: number, authorId: number): Promise<boolean> {
  const write = await Write.findOrFail(writeId)
  return write.authorId == authorId
}