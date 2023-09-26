import { PasswordInsert, UserEntity, UserInsert } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    isAdmin: boolean
    emailVerified: UserEntity['emailVerified']
}

export interface UserRepository extends DefaultRepository<UserInsert, UserEntity> {
    create(body: UserInsert & ExtraInfoOnCreate): Promise<UserEntity>
    isNeedToVerifyEmail(): Promise<boolean>
    passwordIsValid(body: PasswordInsert): Promise<{errors?: string[]}>
}
