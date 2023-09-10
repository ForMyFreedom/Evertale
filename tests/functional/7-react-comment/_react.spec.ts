import { test } from '@japa/runner'
import testIndexByComment from './index-by-comment.spec'
import testReactCommentStore from './store.spec'
import testReactCommentDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'

test.group('7-React-Comment', (group) => {
  Setup(group)
  test('ReactComment-IndexByComment', testIndexByComment)
  test('ReactComment-Store', testReactCommentStore)
  test('ReactComment-Destroy', testReactCommentDestroy)
})
