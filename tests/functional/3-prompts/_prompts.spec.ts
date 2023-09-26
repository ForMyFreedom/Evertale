import { test } from '@japa/runner'
import testPromptIndex from './index.spec'
import testPromptStore from './store.spec'
import testPromptShow from './show.spec'
import testPromptUpdate from './update.spec'
import testPromptDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'

test.group('3-Prompt', (group) => {
  Setup(group)
  test('Prompt-Index', testPromptIndex)
  test('Prompt-Store', testPromptStore)
  test('Prompt-Show', testPromptShow)
  test('Prompt-Update', testPromptUpdate) // @parece que tá dando erro de transaction mesmo com o teste passando
  test('Prompt-Destroy', testPromptDestroy)
})