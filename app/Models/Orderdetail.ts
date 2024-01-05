

import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User' // Assuming you have a User model

export default class Orderdetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column({ columnName: 'user_id' }) // Foreign key column
  public userId: number;

  @belongsTo(() => User) // Belongs to User model
  public user: BelongsTo<typeof User>;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public address: string;

  @column()
  public items: string;

  @column()
  public phone: string;

  @column()
  public qty: number;

  @column()
  public price: number;

 @column()
  public sizes: string;

  @column()
  public order_no: number;


}


