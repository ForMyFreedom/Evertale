import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ReactionType } from 'App/Models/Reaction'

export default class extends BaseSchema {
  protected tableName = 'write_reactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('write_id').unsigned().references('writes.id').onDelete('CASCADE')
      table.enum('type', Object.values(ReactionType))

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
