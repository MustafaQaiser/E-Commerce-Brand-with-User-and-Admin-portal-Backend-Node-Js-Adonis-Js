import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Couriers extends BaseSchema {
  protected tableName = 'couriers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('merchant_id').notNullable();
      table.string('created_by').notNullable();
      table.tinyint('is_active').notNullable();
      table.integer('rule_priority').notNullable();
      table.string('shipping_rule_name').notNullable();
      table.string('courier_priority_type').notNullable();
      table.enum('shipping_type', ['domestic', 'international']).notNullable();
// Use raw SQL to create a JSON column
table.specificType('rule_conditions', 'JSON').notNullable();
table.specificType('priority_couriers', 'JSON').notNullable();
table.specificType('restricted_couriers', 'JSON').notNullable();

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}

