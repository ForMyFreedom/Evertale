/* eslint-disable prettier/prettier */
import Constant from 'App/Models/Constant'
import Prompt from 'App/Models/Prompt'
import Proposal from 'App/Models/Proposal'
import { ReactionType } from 'App/Models/Reaction'
import Write from 'App/Models/Write'

type StoreAdvanceResponse = { toContinueLoop: boolean }

const CONTINUE: StoreAdvanceResponse = { toContinueLoop: true }
const NOT_CONTINUE: StoreAdvanceResponse = { toContinueLoop: false }

export async function tryMakeStoreAdvance(promptId: number): Promise<StoreAdvanceResponse> {
  const prompt = await Prompt.find(promptId)
  if (!prompt || prompt.concluded) { return NOT_CONTINUE }
  await prompt.load('proposals')
  if (prompt.proposals.length === 0) { return CONTINUE }
  const currentProposals = prompt.proposals.filter(proposal => proposal.orderInHistory === prompt.currentIndex)
  if (currentProposals.length === 0) { return CONTINUE }

  currentProposals.sort((a, b) => b.popularity - a.popularity)
  const chosenProposal = currentProposals[0]
  if (chosenProposal.popularity <= 0) { return CONTINUE }
  chosenProposal.definitive = true
  prompt.currentIndex += 1

  await prompt.save()
  await chosenProposal.save()

  console.log(`A História ${promptId} avançou com a Proposta ${chosenProposal.id}!`)

  if (! await storyWasConcluded(prompt, chosenProposal)) {
    return CONTINUE
  } else {
    prompt.concluded = true
    await prompt.save()
    return NOT_CONTINUE
  }
}


async function storyWasConcluded(prompt: Prompt, chosenProposal: Proposal): Promise<Boolean> {
  return (
    prompt.currentIndex === prompt.limitOfExtensions ||
    (await chosenProposalWasConclusive(prompt, chosenProposal))
  )
}

async function chosenProposalWasConclusive(prompt: Prompt, proposal: Proposal): Promise<boolean> {
  const storyPopularity = prompt.popularity
  const amountOfConclusiveReactions = await getAmountOfConclusiveReactions(proposal)
  const config = await Constant.firstOrFail()
  return amountOfConclusiveReactions >= Math.ceil(storyPopularity * config.completionPercentage)
}

async function getAmountOfConclusiveReactions(proposal: Proposal): Promise<number> {
  const response = await Write.query()
    .join('write_reactions', 'writes.id', '=', 'write_reactions.write_id')
    .where('writes.id', '=', proposal.write.id)
    .where('write_reactions.type', '=', ReactionType.CONCLUSIVE)
    .orWhere('write_reactions.type', '=', ReactionType.POSITIVE_CONCLUSIVE)
    .countDistinct('writes.id as id')
    .count('* as total')

  return response[0].$extras.total
}