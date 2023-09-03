import Event from '@ioc:Adonis/Core/Event'
import { tryMakeStoreAdvance } from 'App/Controllers/Real-Time/story-advance/story-advance'
import Prompt from 'App/Models/Prompt'
import Env from '@ioc:Adonis/Core/Env'
import { LiteralTime } from 'App/Utils/time'

Event.on('refresh:daily-prompts', 'DailyPrompt.onRefreshDailyPrompts')

setTimeout(async () => {
  await Event.emit('refresh:daily-prompts', undefined)
}, LiteralTime.MINUTE)

setInterval(() => {
  Event.emit('refresh:daily-prompts', undefined)
}, Env.get('REFRESH_MINUTES_FOR_DAILY_PROMPTS') * LiteralTime.MINUTE)

Event.on('run:prompt', (prompt: Prompt) => {
  console.log(`Tentando avançar história ${prompt.id}`)
  setTimeout(
    async () => {
      if ((await tryMakeStoreAdvance(prompt.id)).toContinueLoop) {
        Event.emit('run:prompt', prompt)
      } else {
        console.log(`Fim da história ${prompt.id}`)
      }
    },
    prompt.timeForAvanceInMinutes * 60000 // @TIME HELPER HERE
  )
})

const promise = Prompt.query().where('concluded', '=', false)
promise.exec().then((activePrompts) => {
  for (const prompt of activePrompts) {
    Event.emit('run:prompt', prompt)
  }
})
