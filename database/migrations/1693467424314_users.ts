// database/migrations/{timestamp}_users.js

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('username', 255).notNullable();
      // Change the unique index length to 191
      table.string('email', 191).notNullable().unique('email_unique', 191);
      table.string('password', 180).notNullable();
      table.string('role', 255).notNullable();
      table.integer('total_orders');
      table.string('image');
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
