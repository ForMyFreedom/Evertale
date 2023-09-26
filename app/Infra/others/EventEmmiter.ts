import { EventEmitter } from "@ioc:forfabledomain";
import Event from '@ioc:Adonis/Core/Event'
import Prompt from "App/Models/Prompt";

export class AdonisEventEmmiter implements EventEmitter {
  public static instance = new AdonisEventEmmiter()

  async emitRunPromptEvent(prompt: Prompt): Promise<void> {
    Event.emit('run:prompt', prompt)
  }
}
