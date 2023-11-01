import { BaseModel } from "@ioc:Adonis/Lucid/Orm"
import CamelCaseNamingStrategy from "Config/camelCase"

export const BOOLEAN_SERIAL = { serialize: (value) => Boolean(value) }


export abstract class BaseAdonisModel extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
}