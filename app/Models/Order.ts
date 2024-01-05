import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number



  @column()
  public main_item: string;

  @column.dateTime({ autoCreate: true })
  public created_At: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_At: DateTime;
}
