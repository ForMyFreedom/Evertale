import { test } from '@japa/runner'

test('0-Welcome', async ({ client }) => {
  const response = await client.get('/api')

  response.assertStatus(200)
  response.assertBodyContains({ response: 'welcome!' })
})
