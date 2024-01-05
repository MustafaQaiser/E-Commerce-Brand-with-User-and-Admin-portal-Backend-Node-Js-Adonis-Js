// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import GeneratedExcel from "App/Models/GeneratedExcel";
import Orderdetail from "App/Models/Orderdetail";
const excel4node = require('excel4node');
import { DateTime } from 'luxon';
import fs from 'fs'
import path from 'path';
import User from "App/Models/User";
import Order from "App/Models/Order";
import ItemDetail from "App/Models/ItemDetail";
export default class OrdersController {

    public MODEL: typeof Orderdetail
    public GENERATE_EXCEL :typeof  GeneratedExcel
    public User : typeof User
    public Order:typeof Order
    public Item_Details:typeof ItemDetail
    async storeOrderDetail({ params, request, response }) {
        try {
          const { id} = params;

          const data = request.only([
            'username',
            'email',
            'address',
            'items',
            'phone',
            'price',
            'sizes',
            'qty'

          ]);

          // Add the user_id to the data

          data.user_id = id;
          data.order_no=  Math.floor(Math.random() * 1000);
          const orderDetail = new Orderdetail();
          orderDetail.fill(data);

          await orderDetail.save();
          const count = await Orderdetail.query()
          .where('user_id', id)
          .count('*');

        // Extract the count from the result
        const totalRecords = count[0].$extras['count(*)'];

        const user = await User.find(id);
        user.total_orders=totalRecords;
          await user.save();
          return response.send({
            success: true,
            message: 'Order detail created successfully.',
            orderDetail,
          });
        } catch (err) {
          return response.status(500).send({
            success: false,
            message: 'Failed to create order detail.',
            error: err.message,
          });
        }
      }
      async getOrderDetailsByUserId({ params, response }) {
        try {
          const {id } = params;

          // Fetch all order details associated with the user_id
          const orderDetails = await Orderdetail.query()
            .where('user_id', id)


          return response.send({
            success: true,
            orderDetails
          });
        } catch (err) {
          return response.status(500).send({
            success: false,
            message: 'Failed to fetch order details.',
            error: err.message
          });
        }
      }
      async search({ params, response }) {
        try {
          const {id } = params;
    console.log(id)
          // Perform a count of records against the provided user ID
          // You can replace this with your database query logic
          const count = await Orderdetail.query()
            .where('user_id', id)
            .count('*');
            console.log(count[0].$extras['count(*)'])
          // Extract the count from the result
          const totalRecords = count[0].$extras['count(*)'];

          return response.status(200).json({ message: 'Search successful', totalRecords });
        } catch (error) {
          console.error(error);
          return response.status(500).json({ message: 'Internal server error' });
        }
      }

      async sortrecords({ params, response }) {
        try {
          const { id } = params;

          // Retrieve the first and last order records based on created_at
          const orders = await Orderdetail.query()
            .where('user_id', id)
            .orderBy('created_at', 'asc') // Ascending order to get the first order
            // .limit(2); // Limit to 2 records (first and last)

            const length= orders.length-1;
          // Extract the first and last orders from the result
          const firstOrder = orders[0];
          const lastOrder = orders[length-1];
      console.log(firstOrder,lastOrder)
          return response.status(200).json({ message: 'Search successful', firstOrder, lastOrder});
        } catch (error) {
          console.error(error);
          return response.status(500).json({ message: 'Internal server error' });
        }
      }





public async getorderfile({ response, params }) {
    const { id } = params;
    try {

      const allorders = await Orderdetail.query()
        .where('user_id', id)

        // Create a new Excel workbook and worksheet
        const wb = new excel4node.Workbook();
        const ws = wb.addWorksheet('Orders');

        // Define header style
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
            },
        });

        // Define headers
        const headers = [
            'order_no',
            'username',
            'email',
            'address',
            'items',
            'phone',
            'qty',
            'price',
            'created_at',
        ];

        // Define the header-to-property mapping
        const headerToPropertyMapping = {
            'order_no': 'order_no',
            'username': 'username',
            'email': 'email',
            'address': 'address',
            'items': 'items',
            'phone': 'phone',
            'qty': 'qty',
            'price': 'price',
            'created_at': 'created_at',
        };

        // Write headers to the first row
        headers.forEach((header, columnIndex) => {
            ws.cell(1, columnIndex + 1).string(header).style(headerStyle);
        });

        // Write order data to subsequent rows
        allorders.forEach((order, rowIndex) => {
            headers.forEach((header, columnIndex) => {
                // Map the header to the corresponding property name
                const propertyName = headerToPropertyMapping[header];

                // Check if the mapping exists and get the cell data
                if (propertyName && order[propertyName] !== undefined) {
                    let cellData = order[propertyName];
                    console.log("dta to ohhjbj",cellData)
                    // Handle date and time formatting

                    if (typeof cellData === 'number') {
                        ws.cell(rowIndex + 2, columnIndex + 1).number(cellData); // Write as a number

                    }
                    else if (cellData instanceof DateTime ) {


                      ws.cell(rowIndex + 2, columnIndex + 1).date(cellData); // Write as a Date
                  }  else {
                        ws.cell(rowIndex + 2, columnIndex + 1).string((cellData || '').toString()); // Write as a string, handle null/undefined
                    }
                } else {
                    // Handle cases where the property does not exist in the order object
                    ws.cell(rowIndex + 2, columnIndex + 1).string(''); // Empty cell
                }
            });
        });

        // Generate a unique file name
        const formattedCreatedAt = DateTime.local().toFormat('yyyyMMddHHmmss');
        const tempFilePath = `Public/files/Order${formattedCreatedAt}.xlsx`;

        // Write the workbook to a file
        wb.write(tempFilePath);

        // Create a record in the GeneratedExcel table
        await GeneratedExcel.create({
            filename: `Order${formattedCreatedAt}.xlsx`,
            user_id: id,
        });

        // Delete records from the Stock table after generating the file

        response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.header('Content-Disposition', 'attachment; filename=exported_stocks.xlsx');
        response.send(`Order${formattedCreatedAt}.xlsx`);
    } catch (error) {
        console.error('Error exporting and clearing stocks:', error);
        response.status(500).json({ error: 'An error occurred while exporting and clearing stocks.' });
    }
}
public async downloadFiles({ request, response }) {
  try {
    const { filename } = request.only(['filename']);
    const filePath = path.join('Public/files/', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Set appropriate headers for the file response
      response.header('Content-Disposition', `attachment; filename="${filename}"`);
      response.download(filePath);
    } else {
      return response.status(404).json({ message: 'File not found.' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return response.status(500).json({ error: 'An error occurred while downloading the file.' });
  }
}

public async orderitems({ request, response }) {
  try {
    // Get the 'main_item' data from the request body
    const { main_item } = request.only(['main_item']);

    // Create a new Order instance
    const order = new Order();

    // Fill the order instance with the 'main_item' data
    order.main_item = main_item; // Assuming 'main_item' is a field in your 'orders' table

    // Save the order to the database
    await order.save();

    // Send a response with the saved order
    response.status(201).send(order);
  } catch (err) {
    console.error("Error:", err);
    response.status(500).send({ error: 'An error occurred while creating the order.' });
  }
}
public async getorderitems({ response }) {
  try {
    const order = await Order.all();  // This fetches all users from the User table


    if (order && order.length)
     {
      return response.send({
        success: true,
        data: order,
      });
    } else {
      return response.send({
        success: false,
        message: "No order items  found.",
      });
    }
  } catch (err) {
    return response.status(500).send({
      success: false,
      message: err.message,
    });
  }
}


public async itemdetails({request,response,params}){
 const { id} = params;
try {
  const data=request.only(['sizes','price']);
  data.order_id = id;
  const itemdetail = new ItemDetail;
  itemdetail.fill(data);

  await itemdetail.save();

   response.status(201).send(itemdetail);

} catch (err) {
  console.error("Error:", err);
  response.status(500).send({ error: 'An error occurred while creating the order.' });
}
}

public async getitemdetailsbyid({response,params}){
  const { id} = params;
 try {
  const itemdetail = await ItemDetail.query()
  .where('order_id', id)


return response.send({
  success: true,
  itemdetail

})


 } catch (err) {
   console.error("Error:", err);
   response.status(500).send({ error: 'An error occurred while creating the order.' });
 }
 }



}
