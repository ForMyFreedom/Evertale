import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import { LiteralTime } from 'App/Utils/time'
import { StoryAdvanceProvider } from '@ioc:Providers/StoryAdvanceService'

export default class HistoryListener {
  public async onRunPrompt(prompt: EventsList['run:prompt']) {
    console.log(`${DateTime.now()}  |  Try Advance History ${prompt.id}`)
    setTimeout(async () => {
      if ((await StoryAdvanceProvider().tryMakeStoreAdvance(prompt.id)).toContinueLoop) {
        Event.emit('run:prompt', prompt)
      } else {
        console.log(`End of History ${prompt.id}`)
      }
    }, prompt.timeForAvanceInMinutes * LiteralTime.MINUTE)
  }
}
