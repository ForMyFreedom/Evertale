import { ExceptionContract } from '../contracts'
import { RestartPasswordInsert, UserEntity, UserInsert } from '../entities'

export interface UsersUsecase {
  index(): Promise<void>
  show(userId: UserEntity['id']): Promise<void>
  storeUser(body: UserInsert, isAdmin: boolean): Promise<void>
  storeAdmin(body: UserInsert): Promise<void>
  update(responserId: UserEntity['id']|undefined, userId: UserEntity['id'], partialBody: Partial<UserInsert>): Promise<void>
  destroy(responserId: UserEntity['id']|undefined, userId: UserEntity['id']): Promise<void>
  verifyEmail(token: string|undefined): Promise<void>
  requestPasswordChange(user: UserEntity|undefined): Promise<void>
  restartPassword(langContract: ExceptionContract, token: string|undefined, body: RestartPasswordInsert): Promise<{error?: string}>
}
