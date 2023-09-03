import { test } from '@japa/runner'
import testIndexByWrite from './index-by-write.spec'
import testReactWriteStore from './store.spec'
import testReactWriteDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'

test.group('6-React-Write', (group) => {
  Setup(group)
  test('ReactWrite-IndexByWrite', testIndexByWrite)
  test('ReactWrite-Store', testReactWriteStore)
  test('ReactWrite-Destroy', testReactWriteDestroy)
})
