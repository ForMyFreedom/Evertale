import Event from '@ioc:Adonis/Core/Event'
import Prompt from 'App/Models/Prompt'
import Env from '@ioc:Adonis/Core/Env'
import { LiteralTime } from 'App/Utils/time'

Event.on('refresh:daily-prompts', 'DailyPrompt.onRefreshDailyPrompts')
Event.on('run:prompt', 'History.onRunPrompt')

setTimeout(async () => {
  await Event.emit('refresh:daily-prompts', undefined)
}, 0.3 * LiteralTime.MINUTE)

setInterval(() => {
  Event.emit('refresh:daily-prompts', undefined)
}, Env.get('REFRESH_MINUTES_FOR_DAILY_PROMPTS') * LiteralTime.MINUTE)

setTimeout(async () => {
  let promise = Prompt.query().where('concluded', '=', false)
  promise.exec().then((activePrompts) => {
    activePrompts = activePrompts.filter(
      (prompt) => !prompt.isDaily || prompt.write.authorId !== null
    )
    for (const prompt of activePrompts) {
      Event.emit('run:prompt', prompt)
    }
  })
}, 0.3 * LiteralTime.MINUTE)
