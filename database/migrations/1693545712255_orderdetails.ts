import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateOrderdetails extends BaseSchema {
  protected tableName = 'orderdetails'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Foreign key
      table.string('username',255)
      table.string('email',255)
      table.string('address',255)
      table.string('items',255)
      table.string('phone', 13).nullable();
      table.integer('qty',255)
      table.integer('price',255)
      table.string('sizes',255)
      table.integer('order_no',255)

      table.timestamps();
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

