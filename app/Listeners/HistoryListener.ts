import Event from '@ioc:Adonis/Core/Event'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import { LiteralTime } from '@ioc:forfabledomain'
import StoryAdvanceProvider from '@ioc:Providers/StoryAdvanceService'

export default class HistoryListener {
  public async onRunPrompt(prompt: EventsList['run:prompt']) {
    console.log(`Hello ${prompt.id} History!`)
    setTimeout(async () => {
      if ((await StoryAdvanceProvider().tryMakeStoreAdvance(prompt.id)).toContinueLoop) {
        Event.emit('run:prompt', prompt)
      } else {
        console.log(`End of History ${prompt.id}`)
      }
    }, prompt.timeForAvanceInMinutes * LiteralTime.MINUTE)
  }
}
