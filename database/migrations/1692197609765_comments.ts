import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('write_id').unsigned().references('writes.id').defaultTo(null).onDelete('CASCADE').notNullable()
      table.integer('author_id').unsigned().references('users.id').defaultTo(null).onDelete('SET NULL').notNullable()
      table.integer('answer_to_id').unsigned().references('comments.id').defaultTo(null).onDelete('CASCADE').nullable()

      table.string('text').notNullable()
      table.boolean('edited').defaultTo(false)
      table.string('image_url').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
