import { ReactionEntity } from "./Reaction";
import { UserEntity } from "./User";

export interface InteractionEntity {
  id: number

  getAuthor(): Promise<UserEntity>
  delete(): Promise<void>
  getReactions(): Promise<ReactionEntity[]>
}