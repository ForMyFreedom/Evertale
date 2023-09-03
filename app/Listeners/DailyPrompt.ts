import { inject } from '@adonisjs/core/build/standalone'
import DailyPromptsController from 'App/Controllers/Http/DailyPromptsController'
import { DateTime } from 'luxon'

@inject()
export default class DailyPrompt {
  constructor(private controller: DailyPromptsController) {}

  public async onRefreshDailyPrompts() {
    console.log(`${DateTime.now()}  |  Reseting Daily Prompts!`)
    await this.controller.DeleteAllNonAppropriatedDailyPrompts()
    await this.controller.CreateDailyPromptsForEachGenre()
  }
}
