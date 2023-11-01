import { GenreValidatorSchema } from 'App/Validators/GenreValidator'
import { postWithAuth } from '../_utils/basic-auth-requests'
import { ApiClient } from '@japa/api-client/build/src/client'
import Genre from 'App/Models/Genre'

export const BASE_URL = '/api/genre'

export const SAMPLE_GENRE: typeof GenreValidatorSchema.props = {
	name: "Amor",
	imageUrl: "https://cdn-icons-png.flaticon.com/512/3773/3773795.png",
	thematicWords: ["Beijo", "Felicidade", "Companheiro"]
}

export const WORDS_SAMPLE = {
  words: ["Palavra1", "Palavra2", "Palavra3"]
}

export const EDIT_SAMPLE_GENRE: Partial<typeof GenreValidatorSchema.props> = {
  imageUrl: 'https://great-awesome-epic-incredible-image.wow/2',
}

export const WRONG_SAMPLE_GENRE = {
	"popularity": 0,
	"thematicgWords": ["Beijo", "Felicidade", "Companheiro"]
}

export const postGenre = async (client: ApiClient) => {
  const response = await postWithAuth(BASE_URL, client, true, SAMPLE_GENRE)
  return response.body().data as Genre
}