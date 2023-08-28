import ExceptionHandler from 'App/Exceptions/Handler'
import { GenreValidatorSchema } from 'App/Validators/GenreValidator'

export const BASE_URL = '/api/genre'

export const ExceptionContract =  ExceptionHandler.contract

export const DEFAULT_BANK = { data: [] }

export const SAMPLE_GENRE: typeof GenreValidatorSchema.props = {
	name: "Amor",
	image: "https://cdn-icons-png.flaticon.com/512/3773/3773795.png",
	thematicWords: ["Beijo", "Felicidade", "Companheiro"]
}

export const WORDS_SAMPLE = {
  words: ["Palavra1", "Palavra2", "Palavra3"]
}

export const EDIT_SAMPLE_GENRE: Partial<typeof GenreValidatorSchema.props> = {
  image: 'https://great-awesome-epic-incredible-image.wow/2',
}

export const WRONG_SAMPLE_GENRE = {
	"popularity": 0,
	"thematicgWords": ["Beijo", "Felicidade", "Companheiro"]
}

