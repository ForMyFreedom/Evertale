import { TokenEntity, UserEntity } from "../../entities";

export interface MailSender {
    sendUserRequestPasswordMail(user: UserEntity, token: TokenEntity): Promise<void>
    sendUserVerificationMail(user: UserEntity, token: TokenEntity): Promise<void>
}