import { BaseHTTPService } from "./BaseHTTPService"
import { ExceptionHandler, ConstantsRepository } from "../contracts"
import { ConstantEntity } from "../entities"
import { ConstantsUsecase } from "../usecases"

export class ConstantsService extends BaseHTTPService implements ConstantsUsecase {
  constructor(
    private readonly constantsRepository: ConstantsRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  public async show(): Promise<void> {
    const theConfig = await this.constantsRepository.getConfig()
    this.exceptionHandler.SucessfullyRecovered(theConfig)
  }

  public async update(contant: Partial<ConstantEntity>): Promise<void> {
    const theConfig = await this.constantsRepository.getConfig()
    if(!theConfig){
      return this.exceptionHandler.ServerMisconfigured()
    }
    const updatedConfig = await this.constantsRepository.update(contant)
    this.exceptionHandler.SucessfullyUpdated(updatedConfig)
  }
}
