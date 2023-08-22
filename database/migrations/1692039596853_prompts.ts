import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prompts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('write_id').unsigned().references('writes.id')

      table.string('title').notNullable()
      table.integer('current_index').defaultTo(0)
      table.boolean('concluded').defaultTo(false)
      table.boolean('is_daily').notNullable().defaultTo(false)
      table.integer('max_size_per_extension').notNullable()
      table.integer('limit_of_extensions').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
