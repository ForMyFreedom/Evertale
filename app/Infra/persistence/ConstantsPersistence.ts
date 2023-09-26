import { ConstantEntity, ConstantsRepository } from "@ioc:forfabledomain";
import AdonisExceptionHandler from "App/Exceptions/Handler";
import Constant from "App/Models/Constant";

const langContract = AdonisExceptionHandler.contract

export class ConstantsPersistence implements ConstantsRepository {
  public static instance = new ConstantsPersistence()

  async getConfig(): Promise<Constant> {
    const config = await Constant.first()
    if (config) {
      return config
    } else {
      throw Error(langContract.ServerMisconfigured);
    }
  }

  async update(partialConfig: Partial<Constant>): Promise<ConstantEntity|null> {
    const constant = await Constant.first()
    if (constant) {
      constant.merge(partialConfig)
      await constant.save()
      return constant
    } else {
      return null
    }
  }
}
