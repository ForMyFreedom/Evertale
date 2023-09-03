import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'

import Genre from 'App/Models/Genre'
import Prompt from 'App/Models/Prompt'
import ThematicWord from 'App/Models/ThematicWord'
import Write from 'App/Models/Write'
import DailyPromptValidator from 'App/Validators/DailyPromptValidator'

export default class DailyPromptsController {
  private static SEPARATOR = ' | '

  public async AppropriateDailyPrompt(ctx: HttpContextContract): Promise<void> {
    const { params, response, auth } = ctx
    const prompt = await Prompt.find(params.id)
    const { text, title } = await new DailyPromptValidator(ctx).validate()
    const userId = auth?.user?.id

    if (!userId) {
      return ExceptionHandler.InvalidAuth(response)
    }
    if (!prompt) {
      return ExceptionHandler.UndefinedId(response)
    }
    if (!prompt.isDaily || prompt.write.authorId !== null) {
      return ExceptionHandler.NotAppropriablePrompt(response)
    }
    if (!this.textRespectPrompt(text, prompt.write.text)) {
      return ExceptionHandler.TextDontRespectPrompt(response)
    }

    prompt.write.authorId = userId
    prompt.write.text = text
    prompt.title = title
    prompt.save()
    prompt.write.save()
    return ExceptionHandler.SucessfullyUpdated(response, prompt)
  }

  public async DeleteAllNonAppropriatedDailyPrompts(): Promise<void> {
    const allDailyPrompts = await Prompt.query().where('isDaily', true)
    for (const prompt of allDailyPrompts) {
      if (prompt.write.authorId === null) {
        await prompt.delete()
      }
    }
  }

  public async CreateDailyPromptsForEachGenre(): Promise<void> {
    const allGenres = await Genre.all()
    for (const genre of allGenres) {
      for (let i = 0; i < genre.popularity; i++) {
        const newWrite = await Write.create({
          text: await this.getRandomText(genre),
          authorId: null,
        })

        const newPrompt = await Prompt.create({
          title: '---',
          isDaily: true,
          writeId: newWrite.id,
          maxSizePerExtension: this.getRandomMaxSizePerExtension(),
          limitOfExtensions: this.getRandomLimitOfExtensions(),
        })
        await newPrompt.related('genres').attach([genre.id])
      }
    }
  }

  private async getRandomText(genre: Genre): Promise<string> {
    let text = ''
    await genre.load('thematicWords')
    let thematicWords: ThematicWord[] = genre.thematicWords
    const amount = thematicWords.length < 3 ? thematicWords.length : 3
    for (let i = 0; i < amount; i++) {
      const word = thematicWords[Math.floor(Math.random() * thematicWords.length)].text
      thematicWords = thematicWords.filter((w) => w.text !== word)
      text += word
      if (i + 1 !== amount) {
        text += DailyPromptsController.SEPARATOR
      }
    }
    return text
  }

  private getRandomMaxSizePerExtension(): number {
    return Math.floor(20 + 30 * Math.random())
  }

  private getRandomLimitOfExtensions(): number {
    if (Math.random() < 0.23) {
      return 2 - 3
    } else {
      return Math.floor(Math.random() * (2 + 3) + 2 + 3) // I like the 23 number...
    }
  }

  private textRespectPrompt(text: string, prompt: string): boolean {
    const wordsInPrompt = prompt.split(DailyPromptsController.SEPARATOR)
    return wordsInPrompt.every((word) => text.toLowerCase().includes(word.toLocaleLowerCase()))
  }
}
