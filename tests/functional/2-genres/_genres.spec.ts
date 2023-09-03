import { test } from '@japa/runner'
import testGenreIndex from './index.spec'
import testGenreStore from './store.spec'
import testGenreShow from './show.spec'
import testGenreUpdate from './update.spec'
import testGenreDestroy from './destroy.spec'
import testGenreInsertWords from './insert-words.spec'
import { Setup } from '../_utils/setup'

test.group('2-Genre', (group) => {
  Setup(group)
  test('Genre-Index', testGenreIndex)
  test('Genre-Store', testGenreStore)
  test('Genre-Show', testGenreShow)
  test('Genre-Update', testGenreUpdate)
  test('Genre-InsertWords', testGenreInsertWords)
  test('Genre-Destroy', testGenreDestroy)
})
