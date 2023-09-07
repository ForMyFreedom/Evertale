import { TestContext } from '@japa/runner'
import { BASE_URL, SAMPLE_CONFIG_1, SAMPLE_CONFIG_2, WRONG_SAMPLE_CONSTANT_1, WRONG_SAMPLE_CONSTANT_2, WRONG_SAMPLE_CONSTANT_3 } from './_data'
import { testPUTUnauthenticated } from '../_utils/basic-tests/unauthenticated'
import { testPUTUnauthorized } from '../_utils/basic-tests/unauthorized'
import { testPUTAccepted } from '../_utils/basic-tests/accepted'
import { testPUTUnacceptedBody } from '../_utils/basic-tests/unaccepted-body'

async function testGenreUpdate({ client }: TestContext): Promise<void> {
  await testPUTUnauthenticated(client, BASE_URL, 1, SAMPLE_CONFIG_1)
  await testPUTUnauthorized(client, BASE_URL, 1, SAMPLE_CONFIG_1)
  await testPUTUnacceptedBody(client, BASE_URL, 1, WRONG_SAMPLE_CONSTANT_1)
  await testPUTUnacceptedBody(client, BASE_URL, 0, WRONG_SAMPLE_CONSTANT_2)
  await testPUTUnacceptedBody(client, BASE_URL, 0, WRONG_SAMPLE_CONSTANT_3)

  await testPUTAccepted(client, BASE_URL, 0, SAMPLE_CONFIG_1)
  await testPUTAccepted(client, BASE_URL, 0, SAMPLE_CONFIG_2)
}

export default testGenreUpdate