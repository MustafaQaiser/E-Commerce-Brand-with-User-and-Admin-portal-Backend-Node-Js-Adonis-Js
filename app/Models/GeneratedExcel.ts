import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GeneratedExcel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public filename: string; // Add filename column

  @column()
  public userId: number; // Add user ID column

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
