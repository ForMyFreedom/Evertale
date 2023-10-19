import { BaseHTTPService } from "./BaseHTTPService"
import { ExceptionHandler } from "../contracts"
import { LoginUsecase, UserRepository } from "@ioc:forfabledomain"

export class LoginService extends BaseHTTPService implements LoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    public exceptionHandler: ExceptionHandler
  ) { super(exceptionHandler) }

  async loginByCredential(email: string, password: string): Promise<void> {
    const token = this.userRepository.validateWithCredential(email, password)
    if (token) {
      this.exceptionHandler.SuccessfullyAuthenticated(token)
    } else {
      this.exceptionHandler.Unauthenticated()
    }
  }

  async loginByToken(token: string): Promise<void> {
    const sucess = await this.userRepository.validateWithToken(token)
    if (sucess) {
      this.exceptionHandler.SuccessfullyAuthenticated()
    } else {
      this.exceptionHandler.Unauthenticated()
    }
  }

}
