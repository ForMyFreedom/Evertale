import { ConstantEntity } from "../entities"

export interface ConstantsUsecase {
  show(): Promise<void>
  update(contant: Partial<ConstantEntity>): Promise<void>
}
