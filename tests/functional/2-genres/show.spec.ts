import { TestContext } from '@japa/runner'
import { BASE_URL, postGenre } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testGenreShow({ client }: TestContext): Promise<void> {
  const genre = await postGenre(client)
  const urlWithId = `${BASE_URL}/${genre.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testGenreShow