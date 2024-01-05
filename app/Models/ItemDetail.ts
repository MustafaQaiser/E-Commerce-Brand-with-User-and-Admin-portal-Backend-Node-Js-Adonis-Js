import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ItemDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number // Define the 'order_id' column

  @column()
  public sizes: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public created_At: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_At: DateTime
}

