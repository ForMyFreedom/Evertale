import { DateTime } from 'luxon'
import DailyPromptsProvider from '@ioc:Providers/DailyPromptsService'

export default class DailyPromptListener {
  public async onRefreshDailyPrompts() {
    console.log(`${DateTime.now()}  |  Reseting Daily Prompts!`)
    await DailyPromptsProvider().deleteAllNonAppropriatedDailyPrompts()
    await DailyPromptsProvider().createDailyPromptsForEachGenre()
  }
}
