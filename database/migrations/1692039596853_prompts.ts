import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prompts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('text').notNullable()
      table.integer('author_id').notNullable().references('users.id').onDelete('NO ACTION')
      table.boolean('is_daily').notNullable().defaultTo(false)
      table.integer('max_size_per_extension').notNullable()
      table.integer('limit_of_extensions').notNullable()
      table.integer('popularity').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
