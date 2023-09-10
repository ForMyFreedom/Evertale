import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class extends BaseSchema {
  protected tableName = 'constants'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.integer('strength_of_positive_opinion')
      table.integer('negative_opinion_strength')
      table.integer('delete_strength')
      table.integer('completion_percentage')
      table.integer('exclusion_percentage')
      table.integer('ban_limit')

      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.raw(
      `INSERT INTO ${this.tableName} (
        strength_of_positive_opinion, negative_opinion_strength, delete_strength,
        completion_percentage, exclusion_percentage, ban_limit
      ) VALUES (
        '${Env.get('DEFAULT_CONST___POSITIVE_STRENGTH')}',
        '${Env.get('DEFAULT_CONST___NEGATIVE_STRENGTH')}',
        '${Env.get('DEFAULT_CONST___DELETE_STRENGTH')}',
        '${Env.get('DEFAULT_CONST___COMPLETION_PERCEN')}',
        '${Env.get('DEFAULT_CONST___EXCLUSION_PERCEN')}',
        '${Env.get('DEFAULT_CONST___BAN_LIMIT')}'
      )`
    )
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
