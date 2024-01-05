import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'messages';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.text('message').notNullable(); // Notification message content
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
