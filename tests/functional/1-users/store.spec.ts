import { TestContext } from '@japa/runner'
import { BASE_URL, NON_ADMIN_USER_SAMPLE, WRONG_USER_SAMPLE } from './_data'
import { testPOSTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPOSTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'
import { testPOSTUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testPOSTAccepted } from '../_utils/basic-tests/accepted'
import { testPOSTUniqueNameNotPassed } from '../_utils/basic-tests/unique-name-not-passed'

async function testUserStore({ client }: TestContext): Promise<void> {
  await testPOSTUnauthenticated(client, BASE_URL, NON_ADMIN_USER_SAMPLE)
  await testPOSTUnauthorized(client, BASE_URL, NON_ADMIN_USER_SAMPLE)
  await testPOSTUnacceptedBody(client, BASE_URL, WRONG_USER_SAMPLE)
  await testPOSTAccepted(client, BASE_URL, NON_ADMIN_USER_SAMPLE)
  await testPOSTUniqueNameNotPassed(client, BASE_URL, NON_ADMIN_USER_SAMPLE)
}

export default testUserStore