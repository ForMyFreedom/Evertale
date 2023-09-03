/* eslint-disable prettier/prettier */
import Prompt from 'App/Models/Prompt'
import Proposal from 'App/Models/Proposal'
import { reactionIsConclusive } from 'App/Utils/reactions'

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

  prompt.save()
  chosenProposal.save()

  console.log(`A História ${promptId} avançou com a Proposta ${chosenProposal.id}!`)

  if (! await storyWasConcluded(prompt, chosenProposal)) {
    return CONTINUE
  } else {
    prompt.concluded = true
    return NOT_CONTINUE
  }
}


async function storyWasConcluded(prompt: Prompt, chosenProposal: Proposal): Promise<Boolean> {
  return (
    prompt.currentIndex === prompt.maxSizePerExtension ||
    (await chosenProposalWasConclusive(chosenProposal))
  )
}

// @ Maybe create a query in future due to performance
// @  const amountOfConclusiveReactions = Proposal.query().join('write_reactions', 'proposals.write_id', '=', 'write_reactions.write_id').where('type', ).countDistinct('id as id').count('* as total')
async function chosenProposalWasConclusive(choosenProposal: Proposal): Promise<boolean> {
  await choosenProposal.load('prompt')
  const storyPopularity = choosenProposal.prompt.popularity
  const write = choosenProposal.write
  await write.load('reactions')
  const amountOfConclusiveReactions = write.reactions.filter((reaction) =>
    reactionIsConclusive(reaction.type)
  ).length
  return amountOfConclusiveReactions > storyPopularity * 2 // @ INSERT CONSTANT HERE
}
