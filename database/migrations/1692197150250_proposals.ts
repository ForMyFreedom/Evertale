import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'proposals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('write_id').unsigned().references('writes.id').onDelete('CASCADE')
      table.integer('prompt_id').unsigned().references('prompts.id')
      table.integer('order_in_history').unsigned().notNullable()
      table.boolean('definitive').defaultTo(false)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
