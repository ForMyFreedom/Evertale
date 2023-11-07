import { test } from '@japa/runner'
import testPromptIndex from './index.spec'
import testPromptStore from './store.spec'
import testPromptShow from './show.spec'
import testPromptUpdate from './update.spec'
import testPromptDestroy from './destroy.spec'
import testPromptIndexByAuthor from './index-by-author.spec'
import { Setup } from '../_utils/setup'

test.group('3-Prompt', (group) => {
  Setup(group)
  test('Prompt-Index', testPromptIndex)
  test('Prompt-Store', testPromptStore)
  test('Prompt-Show', testPromptShow)
  test('Prompt-Update', testPromptUpdate)
  test('Prompt-Destroy', testPromptDestroy)
  test('Prompt-IndexByAuthor', testPromptIndexByAuthor)
})