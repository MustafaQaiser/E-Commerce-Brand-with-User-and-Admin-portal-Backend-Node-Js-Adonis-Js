// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Courier from "App/Models/Courier";
import Database from "@ioc:Adonis/Lucid/Database";
import { json } from "stream/consumers";
export default class CourierRulesController {
  public MODEL: typeof Courier;
  async InsertCourierDetails({ request, response }) {
    try {
      const data = request.only([
        "shipping_rule_name",
        "courier_priority_type",
        "shipping_type",
        "rule_conditions",
        "priority_couriers",
        "restricted_couriers",
      ]);
      console.log("data-------->>>", data);
      const payload = {
        ...data,
        merchant_id: 1,
        created_by: "Mustafa",
        is_active: 0,
        rule_priority: 1,
      };
      const courier = await Courier.create(payload);
      console.log("data----->>>>", courier);
      response.send(courier);
    } catch (err) {
      console.log(err);
      response.send(err);
    }
  }
  async getcourierdetails({ response }) {
    try {
      const order = await Courier.all();
      response.send(order);
    } catch (error) {
      response.send(error);
    }
  }
  async update({ params, request, response }) {
    try {
      const { id } = params;
      let data = request.only([
        "is_active",
        "shipping_rule_name",
        "courier_priority_type",
        "shipping_type",
        "rule_conditions",
        "priority_couriers",
        "restricted_couriers",
      ]);
      data.rule_conditions = JSON.stringify(data.rule_conditions);
      data.priority_couriers = JSON.stringify(data.priority_couriers);
      data.restricted_couriers = JSON.stringify(data.restricted_couriers);
      console.log(data);
      const courier = await Courier.findOrFail(id);
      console.log("courier------->>>", courier);
      if (!courier) {
        return response.status(404).send({ message: "Courier not found" });
      }

      // Update the courier's fields with the new data
      if(data.is_active===0  || data.is_active===1){
        courier.is_active=data.is_active;
        console.log("haaaaaaaaaaaa")
      }
      else{
        courier.courier_priority_type = data.courier_priority_type;
        courier.rule_conditions = data.rule_conditions;
        courier.priority_couriers = data.priority_couriers;
        courier.restricted_couriers = data.restricted_couriers;
      }


      await courier.save();

      return response.send(courier);
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: "Internal server error" });
    }
  }
  // async update({ params, request, response }) {
  //   try {
  //     const { id } = params;
  //     const courier = await Courier.find(id);

  //     if (!courier) {
  //       return response.status(404).send({ message: 'Courier not found' });
  //     }

  //     // Parse the request body to get the updated data
  //     const data = request.post();
  // console.log(data)
  //     // Update the courier's fields with the new data
  //       courier.shipping_rule_name=data.shipping_rule_name;
  //       courier.courier_priority_type=data.courier_priority_type;
  //       courier.shipping_type=data.shipping_type;
  //       courier.rule_conditions=data.rule_conditions;
  //       courier.priority_couriers=data.priority_couriers;
  //       courier.restricted_couriers=data.restricted_couriers;

  //     await courier.save();

  //     return response.send(courier);
  //   } catch (error) {
  //     console.error(error);
  //     return response.status(500).send({ message: 'Internal server error' });
  //   }
  // }
}
