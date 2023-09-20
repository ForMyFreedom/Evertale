import { TokenEntity, UserEntity } from "../../entities";

export interface TokenRepository {
    create(user: UserEntity, type: string): Promise<TokenEntity>
    findByToken(token: string): Promise<TokenEntity|null>
    delete(tokenId: TokenEntity['id']): Promise<TokenEntity|null>
}
