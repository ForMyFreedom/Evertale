import { column } from "@ioc:Adonis/Lucid/Orm"
import { DateTime } from "luxon"
import { ConstantEntity } from '@ioc:forfabledomain'
import { BaseAdonisModel } from "./_Base"

export default class Constant extends BaseAdonisModel implements ConstantEntity {
  @column({ isPrimary: true })
  public id: number

  @column()
  strengthOfPositiveOpinion: number
  @column()
  strengthOfNegativeOpinion: number
  @column()
  deleteStrength: number
  @column()
  completionPercentage: number
  @column()
  exclusionPercentage:number
  @column()
  banLimit: number
  @column()
  maxImageBythesByNonPremium: number


  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
