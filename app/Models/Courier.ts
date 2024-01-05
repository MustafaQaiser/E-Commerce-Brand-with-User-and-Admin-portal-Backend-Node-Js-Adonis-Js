import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { int } from 'aws-sdk/clients/datapipeline'
import { Json } from 'aws-sdk/clients/robomaker'
enum shipping_type{
  domestic = 'domestic',
  international = 'international'
}

export default class Courier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public merchant_id: number

  @column()
  public created_by: string

  @column()
  public is_active: int

  @column()
  public rule_priority: number

  @column()
  public shipping_rule_name: string

  @column()
  public courier_priority_type: string

  @column()
  public shipping_type: shipping_type

  @column()
  public rule_conditions: Json

  @column()
  public priority_couriers: Json

  @column()
  public restricted_couriers: Json

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
