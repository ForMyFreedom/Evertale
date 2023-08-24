import { test } from '@japa/runner'

test('welcome route', async ({ client }) => {
  const response = await client.get('/api')

  response.assertStatus(200)
  response.assertBodyContains({ response: 'welcome!' })
})
