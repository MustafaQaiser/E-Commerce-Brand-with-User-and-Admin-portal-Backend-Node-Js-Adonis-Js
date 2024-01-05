
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'generated_excels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('filename');
      table.integer('user_id').notNullable() // Add user_id column
      // unsigned().references('id').inTable('users').onDelete('CASCADE').
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(); 
    })
  }

  public async down () {
    
    this.schema.dropTable(this.tableName)
  }
}
