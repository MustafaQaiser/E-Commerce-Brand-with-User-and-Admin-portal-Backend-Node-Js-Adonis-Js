import { DateTime } from 'luxon';
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm';
import User from './User'; // Import the User model

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public order_no: string;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public address: string;

  @column()
  public items: string;

  @column()
  public size: string;

  @column()
  public phone: string;

  @column()
  public sub_total: number; // Change the type to number for sub_total

  @column()
  public qty: number; // Change the type to number for qty

  @column()
  public total_price: number; // Change the type to number for total_price

  @column.dateTime()
  public date_time: DateTime;

  @column()
  public user_id: number; // Add user_id column

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}

