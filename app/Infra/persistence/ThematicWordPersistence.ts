import { ThematicWordEntity, ThematicWordRepository } from "@ioc:forfabledomain"
import ThematicWord from "App/Models/ThematicWord"

export class ThematicWordPersistence implements ThematicWordRepository {
  public static instance = new ThematicWordPersistence()

  async create(body: Pick<ThematicWordEntity, 'text'|'genreId'>): Promise<ThematicWord> {
    return ThematicWord.create(body)
  }
}