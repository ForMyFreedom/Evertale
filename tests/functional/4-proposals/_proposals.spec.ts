import { test } from '@japa/runner'
import testProposalIndexByPrompt from './index-by-prompt.spec'
import testProposalIndexByAuthor from './index-by-author.spec'
import testActualProposalIndexByPrompt from './actual-index-by-prompt.spec'
import testProposalStore from './store.spec'
import testProposalShow from './show.spec'
import testProposalUpdate from './update.spec'
import testProposalDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'

test.group('4-Proposal', (group) => {
  Setup(group)
  test('Proposal-Store', testProposalStore)
  test('Proposal-Show', testProposalShow)
  test('Proposal-IndexByPrompt', testProposalIndexByPrompt)
  test('Proposal-ActualIndexByPrompt', testActualProposalIndexByPrompt)
  test('Proposal-Update', testProposalUpdate)
  test('Proposal-Destroy', testProposalDestroy)
  test('Proposal-IndexByAuthor', testProposalIndexByAuthor)
})