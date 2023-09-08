import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import { tryMakeStoreAdvance } from 'App/Controllers/Real-Time/story-advance/story-advance'
import { LiteralTime } from 'App/Utils/time'

export default class History {
  public async onRunPrompt(prompt: EventsList['run:prompt']) {
    console.log(`${DateTime.now()}  |  Try Advance History ${prompt.id}`)
    setTimeout(async () => {
      if ((await tryMakeStoreAdvance(prompt.id)).toContinueLoop) {
        Event.emit('run:prompt', prompt)
      } else {
        console.log(`End of History ${prompt.id}`)
      }
    }, prompt.timeForAvanceInMinutes * LiteralTime.MINUTE)
  }
}
