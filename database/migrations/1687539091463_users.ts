import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 125).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('nickname', 125).notNullable().defaultTo('')
      table.string('primary_color_hex', 7).notNullable().defaultTo('#000000')
      table.string('secondary_color_hex', 7).notNullable().defaultTo('#ffffff')
      table.string('image_url').nullable()
      table.boolean('is_admin').notNullable()
      table.boolean('is_premium').defaultTo(false)
      table.boolean('email_verified').notNullable()
      table.integer('score').defaultTo(0)
      table.timestamp('birth_date').notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      table.dateTime('deleted_at').defaultTo(null)
      table
        .timestamp('created_at', { useTz: true })
        .defaultTo(new Date().toISOString().substring(0, 10))
      table
        .timestamp('updated_at', { useTz: true })
        .defaultTo(new Date().toISOString().substring(0, 10))
    })

    this.schema.raw(
      `INSERT INTO ${this.tableName} (
        name, email, birth_date, password, is_admin, email_verified
      ) VALUES (
        '${Env.get('USER_ROOT_NAME')}',
        '${Env.get('USER_ROOT_EMAIL')}',
        '1999-09-19',
        '${await Hash.make(Env.get('USER_ROOT_PASSWORD'))}',
        true,
        true
      )`
    )
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
