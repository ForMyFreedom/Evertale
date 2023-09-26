import Event from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import { LiteralTime } from '@ioc:forfabledomain'

Event.on('refresh:daily-prompts', 'DailyPromptListener.onRefreshDailyPrompts')

Event.emit('refresh:daily-prompts', undefined)

setInterval(() => {
    Event.emit('refresh:daily-prompts', undefined)
}, Env.get('REFRESH_MINUTES_FOR_DAILY_PROMPTS') * LiteralTime.MINUTE)
