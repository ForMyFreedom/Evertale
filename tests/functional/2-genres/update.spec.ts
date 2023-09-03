import { TestContext } from '@japa/runner'
import { BASE_URL, EDIT_SAMPLE_GENRE, postGenre } from './_data'
import { testPUTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPUTUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testPUTUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testPUTAccepted } from '../_utils/basic-tests/accepted'

async function testGenreUpdate({ client }: TestContext): Promise<void> {
  const genre = await postGenre(client)

  await testPUTUnauthenticated(client, BASE_URL, genre.id, EDIT_SAMPLE_GENRE)
  await testPUTUnauthorized(client, BASE_URL, genre.id, EDIT_SAMPLE_GENRE)
  await testPUTUndefinedId(client, BASE_URL, EDIT_SAMPLE_GENRE)
  await testPUTAccepted(client, BASE_URL, genre.id, EDIT_SAMPLE_GENRE)
}

export default testGenreUpdate