import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users'); // Add this line

      table.string('order_no', 255).nullable();
      table.string('username', 255).nullable();
      table.string('email', 255).nullable();
      table.string('address', 255).nullable();
      table.string('items', 255).nullable();
      table.string('size', 255).nullable();
      table.string('phone', 255).nullable();
      table.string('sub_total', 255).nullable();
      table.string('qty', 255).nullable();
      table.string('total_price', 255).nullable();
      table.string('date_time', 255).nullable();

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
