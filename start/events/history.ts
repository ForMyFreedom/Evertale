/* eslint-disable prettier/prettier */
import Event from '@ioc:Adonis/Core/Event'
import Prompt from 'App/Models/Prompt'

Event.on('run:prompt', 'History.onRunPrompt')

let promise = Prompt.query().where('concluded', '=', false)
promise.exec().then((activePrompts) => {
  activePrompts = activePrompts.filter(
    (prompt) => !prompt.isDaily || prompt.write.authorId !== null
  )
  for (const prompt of activePrompts) {
    Event.emit('run:prompt', prompt)
  }
})
