import {  GenreEntity, GenreInsert } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

export interface GenresRepository extends DefaultRepository<GenreInsert, GenreEntity> {
    create(body: Omit<GenreInsert, 'thematicWords'>): Promise<GenreEntity>
    loadGenresWithWords(): Promise<GenreEntity[]>
    eraseAllWordsFromGenre(genre: GenreEntity): Promise<void>
    wordAlreadyInGenre(word: string, genreId: GenreEntity['id']): Promise<boolean>
}
