import type { ApplicationContract } from '@ioc:Adonis/Core/Application'


export default class ServiceProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    this.app.container.singleton('ServiceProvider', () => {
      return new (require('./data/ServiceSolvers').default)
    })
  }

  public async boot() { }

  public async ready() { }

  public async shutdown() { }
}
