
export interface LoginUsecase {
  loginByCredential(email: string, password: string): Promise<void>
  loginByToken(token: string): Promise<void>
}