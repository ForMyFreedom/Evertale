import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'proposals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('write_id').unsigned().references('writes.id').defaultTo(null).onDelete('CASCADE').notNullable()
      table.integer('prompt_id').unsigned().references('prompts.id').defaultTo(null).onDelete('CASCADE').notNullable()
      table.integer('order_in_history').unsigned().notNullable()
      table.boolean('definitive').defaultTo(false)
      table.string('current_history_text').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
