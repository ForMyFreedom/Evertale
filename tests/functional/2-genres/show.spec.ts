import { TestContext } from '@japa/runner'
import { BASE_URL, postGenre } from './_data'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { testGETAccepted } from '../_utils/basic-tests/accepted'
import { ConnectionType } from '../_utils/basic-auth-requests'

async function testGenreShow({ client }: TestContext): Promise<void> {
  const genre = await postGenre(client)
  const urlWithId = `${BASE_URL}/${genre.id}`

  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
  await testGETAccepted(client, urlWithId, ConnectionType.NotConnected)
}

export default testGenreShow