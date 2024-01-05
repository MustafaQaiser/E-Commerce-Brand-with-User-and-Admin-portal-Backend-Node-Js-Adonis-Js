
// database/migrations/{timestamp}_user_profiles.js

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserProfiles extends BaseSchema {
  protected tableName = 'user_profiles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('address', 255).nullable();
      table.string('city', 255).nullable();
      table.string('phone', 13).nullable();
      table.timestamps(); 
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
