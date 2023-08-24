import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName1 = 'genres'
  protected tableName2 = 'writes'

  public async up() {
    this.schema.alterTable(this.tableName1, (table) => {
      table.dropColumn('popularity')
    })

    this.schema.alterTable(this.tableName2, (table) => {
      table.dropColumn('popularity')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName1, (table) => {
      table.integer('popularity').notNullable().defaultTo(0)
    })

    this.schema.alterTable(this.tableName2, (table) => {
      table.integer('popularity').notNullable().defaultTo(0)
    })
  }
}
