import { test } from '@japa/runner'
import testUserIndex from './index.spec'
import testUserStore from './store.spec'
import testUserShow from './show.spec'
import testUserUpdate from './update.spec'
import testUserDestroy from './destroy.spec'

test.group('User', () => {
  test('User-Index', testUserIndex)
  test('User-Store', testUserStore)
  test('User-Show', testUserShow)
  test('User-Update', testUserUpdate)
  test('User-Destroy', testUserDestroy)
})

