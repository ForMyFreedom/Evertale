import { PaginationData, PromptEntity, PromptEntityWithWrite, PromptInsert, PromptRepository, ProposalWithWrite, UserEntity, WriteEntity } from "@ioc:forfabledomain"
import Prompt from "App/Models/Prompt"
import { paginate } from "./utils"
import Write from "App/Models/Write"

export class PromptPersistence implements PromptRepository {
  public static instance = new PromptPersistence()

  async create(body: Omit<PromptInsert, "text" | "genreIds">): Promise<PromptEntity> {
    const prompt = await Prompt.create(body)
    await prompt.load('write')
    return prompt
  }

  async removeAllGenresFromPrompt(prompt: Prompt): Promise<void> {
    await prompt.related('genres').detach()
  }

  async setGenresInPrompt(prompt: Prompt, genreIds: number[]): Promise<boolean> {
    try {
      await prompt.related('genres').attach(genreIds)
      await prompt.load('genres')
      return true
    } catch (e) {
      return false
    }
  }

  async find(entityId: number): Promise<PromptEntityWithWrite | null> {
    const prompt = await Prompt.find(entityId)
    if (prompt) {
      await prompt.load('genres')
      await prompt.write.load('author')
      return prompt
    } else {
      return null
    }
  }

  async findAll(page?: number, limit?: number): Promise<PaginationData<PromptEntity>> {
    return paginate(await Prompt.query().paginate(page || 1, limit))
  }

  async findAllByAuthor(authorId: number, page?: number | undefined, limit?: number | undefined): Promise<PaginationData<PromptEntity>> {
    return paginate(
      await Prompt.query()
        .join('writes', 'writes.id', '=', 'prompts.write_id')
        .where('writes.author_id', '=', authorId)
        .paginate(page || 1, limit)
    )
  }

  async delete(entityId: number): Promise<PromptEntity | null> {
    const prompt = await Prompt.find(entityId)
    if (prompt) {
      await prompt.delete()
      return prompt
    } else {
      return null
    }
  }

  async update(entityId: number, partialBody: Partial<PromptEntity>): Promise<PromptEntity | null> {
    const prompt = await Prompt.find(entityId)
    if (prompt) {
      prompt.merge(partialBody)
      await prompt.save()
      await prompt.load('write')
      return prompt
    } else {
      return null
    }
  }

  async promptIsConcluded(promptId: number): Promise<boolean> {
    const prompt = await this.find(promptId)
    if (prompt) {
      return prompt.concluded
    } else {
      return false
    }
  }
  
  async findByWriteId(writeId: number): Promise<PromptEntity | null> {
    const prompt = await Prompt.query().where('writeId', '=', writeId)
    if (prompt.length > 0){
      return prompt[0]
    } else {
      return null
    }
  }
  
  async getAllDailyPrompt(): Promise<PromptEntity[]> {
    return Prompt.query().where('isDaily', true)
  }

  async getProposals(prompt: Prompt|Prompt['id']): Promise<ProposalWithWrite[]> {
    if (typeof prompt === 'number') {
      const promptModel = await Prompt.find(prompt)
      if (promptModel) {
        await promptModel.load('proposals')
        return promptModel.proposals
      } else {
        return []
      }
    } else {
      await prompt.load('proposals')
      return prompt.proposals
    }
  }

  async getWrite(prompt: number | Prompt): Promise<WriteEntity|null> {
    let finalPrompt: Prompt
    if (typeof prompt === 'number') {
      const req = await Prompt.find(prompt)
      if(!req) { return null }
      finalPrompt = req
    } else {
      finalPrompt = prompt
    }

    await finalPrompt.load('write')
    return finalPrompt.write
  }

  async getAuthor(prompt: number | Prompt): Promise<UserEntity|null> {
    const write = await this.getWrite(prompt) as Write
    if(write){
      await write.load('author')
      return write.author
    }
    return null
  }
}