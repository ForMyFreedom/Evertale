import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Prompt from 'App/Models/Prompt'
import Proposal from 'App/Models/Proposal'
import Write from 'App/Models/Write'
import ProposalValidator from 'App/Validators/ProposalValidator'

export default class ProposalsController {
  public async index({ response }: HttpContextContract): Promise<void> {
    const proposals = await Proposal.all()
    ExceptionHandler.SucessfullyRecovered(response, proposals)
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    try {
      const proposal = await Proposal.findByOrFail('id', params.id)
      await proposal.load('prompt')
      await proposal.write.load('author')
      delete proposal.write.$attributes.authorId
      ExceptionHandler.SucessfullyRecovered(response, proposal)
    } catch (e) {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, auth } = ctx
    const { text, popularity, promptId, ...body } = await new ProposalValidator(ctx).validate()
    const authorId = auth?.user?.id
    if (authorId) {
      const prompt = await Prompt.findOrFail(promptId)
      if (prompt.concluded) {
        return ExceptionHandler.CantProposeToClosedHistory(response)
      }
      const write = await Write.create({ text: text, popularity: 0, authorId: authorId })
      const proposal = await Proposal.create({
        ...body,
        writeId: write.id,
        promptId: promptId,
        orderInHistory: prompt.currentIndex,
      })
      await proposal.load('write')
      await proposal.write.load('author')
      await proposal.load('prompt')
      ExceptionHandler.SucessfullyCreated(response, proposal)
    } else {
      ExceptionHandler.InvalidUser(response)
    }
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    const { response, params, auth } = ctx
    const proposal = await Proposal.find(params.id)
    const { text, popularity } = await new ProposalValidator(ctx).validateAsOptional()
    if (proposal) {
      if (proposal.write.authorId !== auth?.user?.id) {
        ExceptionHandler.CantEditOthersWrite(response)
        return
      }

      await Write.updateOrCreate(
        { id: proposal.write.id },
        { text: text, popularity: popularity, edited: true }
      )

      await proposal.load('write')
      ExceptionHandler.SucessfullyUpdated(response, proposal)
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }

  public async destroy({ response, params, auth }: HttpContextContract): Promise<void> {
    const proposal = await Proposal.find(params.id)
    if (proposal) {
      if (proposal.write.authorId === auth?.user?.id) {
        await proposal.delete()
        ExceptionHandler.SucessfullyDestroyed(response, proposal)
      } else {
        ExceptionHandler.CantDeleteOthersWrite(response)
      }
    } else {
      ExceptionHandler.UndefinedId(response)
    }
  }
}
