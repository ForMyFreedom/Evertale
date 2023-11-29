import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'genre_prompt'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('genre_id').unsigned().references('genres.id').defaultTo(null).onDelete('CASCADE')
      table.integer('prompt_id').unsigned().references('prompts.id').defaultTo(null).onDelete('CASCADE')
      table.unique(['genre_id', 'prompt_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
