import { PromptInsert, PromptEntity, GenreEntity, WriteEntity } from "../../entities";
import { DefaultRepository } from "./_DefaultRepository";

type ExtraInfoOnCreate = {
    writeId: WriteEntity['id'],
    isDaily?: boolean
}

export interface PromptRepository extends DefaultRepository<PromptInsert & ExtraInfoOnCreate, PromptEntity> {
    create(body: Omit<PromptInsert, 'text'|'genreIds'> & ExtraInfoOnCreate): Promise<PromptEntity>
    removeAllGenresFromPrompt(prompt: PromptEntity): Promise<void>
    setGenresInPrompt(prompt: PromptEntity, genreIds: GenreEntity['id'][]): Promise<boolean>
    promptIsConcluded(promptId: PromptEntity['id']): Promise<boolean>
    findByWriteId(writeId: WriteEntity['id']): Promise<PromptEntity | null>
    getAllDailyPrompt(): Promise<PromptEntity[]>
}

