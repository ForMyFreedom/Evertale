import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up () {
    /* add maxImageBythesByNonPremium in constants*/
    this.schema.table('constants', (table) => {
      table.integer('max_image_bythes_by_non_premium').defaultTo(2000)
    })
  }

  public async down () {
    this.schema.table('constants', (table) => {
      table.dropColumn('max_image_bythes_by_non_premium')
    })
  }
}
