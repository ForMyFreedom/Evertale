import { ThematicWordEntity } from "../../entities";

export interface ThematicWordRepository {
    create(body: Pick<ThematicWordEntity, 'text'|'genreId'>): Promise<ThematicWordEntity>
}
