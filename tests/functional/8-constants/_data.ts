import { ConstantsValidatorSchema } from 'App/Validators/ConstantValidator'

export const BASE_URL = '/api/constants'

export const SAMPLE_CONFIG_1: typeof ConstantsValidatorSchema.props = {
  strengthOfPositiveOpinion: 20,
  strengthOfNegativeOpinion: 30,
  deleteStrength: 50,
  completionPercentage: 0.23,
  exclusionPercentage: 0.32,
  banLimit: -2000,
  maxImageBythesByNonPremium: 2000000,
}

export const SAMPLE_CONFIG_2: Partial<typeof ConstantsValidatorSchema.props> = {
  exclusionPercentage: 0.23,
  banLimit: -1000
}

export const WRONG_SAMPLE_CONSTANT_1 = {
  strengthOfPositiveOpinion: -20,
  strengthOfNegativeOpinion: -30,
  deleteStrength: -50,
}

export const WRONG_SAMPLE_CONSTANT_2 = {
  completionPercentage: 2.23,
  exclusionPercentage: 3.32,
}

export const WRONG_SAMPLE_CONSTANT_3 = {
  banLimit: 1000,
}
