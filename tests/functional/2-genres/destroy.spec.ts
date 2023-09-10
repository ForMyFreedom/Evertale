import { TestContext } from '@japa/runner'
import { BASE_URL, postGenre } from './_data'
import { testDELETEUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testDELETEUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testDELETEUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testDELETEAccepted } from '../_utils/basic-tests/accepted'

async function testGenreDestroy({ client }: TestContext): Promise<void> {
  const genre = await postGenre(client)

  await testDELETEUnauthenticated(client, BASE_URL, genre.id)
  await testDELETEUndefinedId(client, BASE_URL)
  await testDELETEUnauthorized(client, BASE_URL, genre.id)
  await testDELETEAccepted(client, BASE_URL, genre.id)
}

export default testGenreDestroy