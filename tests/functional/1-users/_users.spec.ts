import { test } from '@japa/runner'
import testUserIndex from './index.spec'
import testUserStore from './store.spec'
import testUserShow from './show.spec'
import testUserUpdate from './update.spec'
import testUserDestroy from './destroy.spec'
import { Setup } from '../_utils/setup'


test.group('1-User', (group) => {
  Setup(group)
  test('User-Index', testUserIndex)
  test('User-Store', testUserStore)
  test('User-Show', testUserShow)
  test('User-Update', testUserUpdate)
  test('User-Destroy', testUserDestroy)
})
