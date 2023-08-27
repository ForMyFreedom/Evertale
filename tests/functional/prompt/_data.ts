import ExceptionHandler from 'App/Exceptions/Handler'
import { PromptValidatorSchema } from 'App/Validators/PromptValidator'

export const BASE_URL = '/api/prompt'

export const ExceptionContract =  ExceptionHandler.contract

export const DEFAULT_BANK = { data: [] }

export const SAMPLE_PROMPT: typeof PromptValidatorSchema.props = {
	title: "O aaaa",
	text: "Bom dia",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	popularity: undefined,
	concluded: undefined
}

export const EDIT_SAMPLE_PROMPT: Partial<typeof PromptValidatorSchema.props> = {
	concluded: true,
	text: "Opa"
}

export const WRONG_SAMPLE_GENRE = {
	title: "O aaaa",
	maxSizePerExtension: 50,
	limitOfExtensions: 5,
	genreIds: [1],
	popularity: undefined,
	concluded: undefined
}

