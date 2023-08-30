import Event from '@ioc:Adonis/Core/Event'
import { tryMakeStoreAdvance } from 'App/Controllers/Real-Time/story-advance/story-advance'
import Prompt from 'App/Models/Prompt'

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
