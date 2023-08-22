import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  ModelQueryBuilderContract,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Genre from './Genre'
import Write from './Write'

export default class Prompt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column({ serialize: (value) => Boolean(value) })
  public isDaily: boolean

  @column()
  public currentIndex: number

  @column({ serialize: (value) => Boolean(value) })
  public concluded: boolean

  @column()
  public writeId: number

  @belongsTo(() => Write)
  public write: BelongsTo<typeof Write>

  @manyToMany(() => Genre)
  public genres: ManyToMany<typeof Genre>

  @column()
  public maxSizePerExtension: number

  @column()
  public limitOfExtensions: number

  @beforeFind()
  @beforeFetch()
  public static loadWrite(query: ModelQueryBuilderContract<typeof Prompt>) {
    query.preload('write')
  }
}
