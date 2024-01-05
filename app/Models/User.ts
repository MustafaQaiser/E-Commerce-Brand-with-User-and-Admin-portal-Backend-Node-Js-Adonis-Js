// app/Models/User.ts

import { DateTime } from 'luxon';
import { BaseModel, column, hasOne, HasOne,  HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import UserProfile from 'App/Models/UsersProfile';
import Orderdetail from 'App/Models/Orderdetail';
import Product from './Product';
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public role: string;

  @column()
  public total_orders: number;

  @column()
  public image: string;

  @hasOne(() => UserProfile, {
    localKey: 'id',
    foreignKey: 'user_id',
  })

  public profile: HasOne<typeof UserProfile>;

  @hasMany(() => Orderdetail, { foreignKey: 'user_id' })
  public orderdetails: HasMany<typeof Orderdetail>;

  @hasMany(() => Product)
  public products: HasMany<typeof Product>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
