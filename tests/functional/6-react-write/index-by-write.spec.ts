import { TestContext } from '@japa/runner'
import { BASE_URL, postReactWrite } from './_data'
import { testGETUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testGETUndefinedId } from '../_utils/basic-tests/undefined-id'
import { ConnectionType, testGETAccepted } from '../_utils/basic-tests/accepted'

async function testIndexByWrite({ client }: TestContext): Promise<void> {
  const reactWrite = await postReactWrite(client)
  const urlWithId = `${BASE_URL}/${reactWrite.id}`

  await testGETUnauthenticated(client, urlWithId)
  await testGETUndefinedId(client, BASE_URL)
  await testGETAccepted(client, urlWithId, ConnectionType.Admin)
  await testGETAccepted(client, urlWithId, ConnectionType.NonAdmin)
}

export default testIndexByWrite