import { test } from '@japa/runner'
import testCommentIndexByWrite from './index-by-write.spec'
import testCommentStore from './store.spec'
import testCommentUpdate from './update.spec'
import testCommentDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'

test.group('5-Comment', (group) => {
  Setup(group)
  test('Comment-IndexByWrite', testCommentIndexByWrite)
  test('Comment-Store', testCommentStore)
  test('Comment-Update', testCommentUpdate)
  test('Comment-Destroy', testCommentDestroy)
})
