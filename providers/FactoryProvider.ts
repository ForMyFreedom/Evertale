import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class FactoryProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    const { default: ServicesHandlers } = await import('./ServicesHandlers')

    const serviceHandler = new ServicesHandlers()
    const allHandlers = serviceHandler.allHandlers

    for (const handler of Object.keys(allHandlers)) {
      this.app.container.singleton(
        `Providers/${handler}`, allHandlers[handler]
      )
    }
  }

  public async boot() { }

  public async ready() { }

  public async shutdown() { }
}
