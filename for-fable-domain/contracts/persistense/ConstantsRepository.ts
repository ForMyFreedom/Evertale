import { ConstantEntity } from "../../entities"

export interface ConstantsRepository {
    getConfig(): Promise<ConstantEntity>
    update(partialConfig: Partial<ConstantEntity>): Promise<ConstantEntity|null>
}
