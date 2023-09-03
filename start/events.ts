/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import { LiteralTime } from 'App/Utils/time'

Event.on('refresh:daily-prompts', 'DailyPrompt.onRefreshDailyPrompts')

setTimeout(async () => {
  await Event.emit('refresh:daily-prompts', undefined)
}, LiteralTime.MINUTE)

setInterval(() => {
  Event.emit('refresh:daily-prompts', undefined)
}, Env.get('REFRESH_MINUTES_FOR_DAILY_PROMPTS') * LiteralTime.MINUTE)
