import DailyPromptsProvider from '@ioc:Providers/DailyPromptsService'

export default class DailyPromptListener {
  public async onRefreshDailyPrompts() {
    await DailyPromptsProvider().refreshDailyPrompt()
  }
}
