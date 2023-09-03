import { TestContext } from '@japa/runner'
import { BASE_URL, SAMPLE_GENRE, WRONG_SAMPLE_GENRE } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { testPOSTUniqueNameNotPassed } from '../_utils/basic-tests/unique-name-not-passed'

async function testGenreStore({ client }: TestContext): Promise<void> {
  await testPOSTUnauthenticated(client, BASE_URL, SAMPLE_GENRE)
  await testPOSTUnauthorized(client, BASE_URL, SAMPLE_GENRE)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_SAMPLE_GENRE)
  await testPOSTAccepted(client, BASE_URL, SAMPLE_GENRE)
  await testPOSTUniqueNameNotPassed(client, BASE_URL, SAMPLE_GENRE)
}

export default testGenreStore