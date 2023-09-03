/* eslint-disable prettier/prettier */
import DailyPromptsController from "App/Controllers/Http/DailyPromptsController"
import { LiteralTime } from "App/Utils/time"
import { DateTime } from "luxon"

export class DailyPromptGerenciator {
  private static INTERVAL: number = 1 * LiteralTime.MINUTE
  private static TIME_FOR_REFRESH_PROMPTS = 1 * LiteralTime.DAY
  private lastCreation: DateTime|null = null
  private controller: DailyPromptsController

  constructor() {
    this.controller = new DailyPromptsController()
  }

  public operate(): void {
    setInterval(async () => {
      const currentTime = DateTime.now()
      if (
        !this.lastCreation ||
        currentTime.diff(this.lastCreation).milliseconds >= DailyPromptGerenciator.TIME_FOR_REFRESH_PROMPTS
      ) {
        console.log(`${currentTime}  |  Reseting Daily Prompts!`)
        await this.controller.DeleteAllNonAppropriatedDailyPrompts()
        await this.controller.CreateDailyPromptsForEachGenre()
        this.lastCreation = currentTime
      }
    }, DailyPromptGerenciator.INTERVAL)
  }
}
