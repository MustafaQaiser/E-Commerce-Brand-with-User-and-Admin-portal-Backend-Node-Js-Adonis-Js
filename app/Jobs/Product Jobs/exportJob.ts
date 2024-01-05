import csvController from 'App/Controllers/Http/CsvController';
import Queues, { QueuePayload } from 'App/Modules/Queue';
import excel4node from 'excel4node';
import { DateTime } from 'luxon';
import GeneratedExcel from 'App/Models/GeneratedExcel';
// import Job from 'App/Models/Job';
import Product from 'App/Models/Product';
import S3 from '../../awsconfig'
export interface DataPayload {
  data: any,
}
export interface Response {
  list?: any,
  props?: any,
}
export class exportJob extends Queues {

  protected data: DataPayload
  public response: Response = {}
  public list: any = {}

  constructor(payload: QueuePayload, data: DataPayload) {
    super(payload, data);
  }

  public async handle() {
    const { data } = this.data
    console.log('data11111', data.user_id);
    const CsvController = new csvController();


    console.log('auto get shipper advice list started', new Date().toLocaleString());

    try {
      try {
        const allproducts = await Product.query()
        .where('user_id', data.user_id)

        allproducts.reverse();
        const wb = new excel4node.Workbook();
        const ws = wb.addWorksheet('Product');

        const headerStyle = wb.createStyle({
          font: {
            bold: true,
          },
        });

        ws.cell(1, 1).string('Order No').style(headerStyle);
        ws.cell(1, 2).string('Username').style(headerStyle);  // Change the header
        ws.cell(1, 3).string('Email').style(headerStyle);  // Change the header
        ws.cell(1, 4).string('Address').style(headerStyle);  // Change the header
        ws.cell(1, 5).string('Items').style(headerStyle);  // Change the header
        ws.cell(1, 6).string('size').style(headerStyle);  // Change the header
        ws.cell(1, 7).string('Phone').style(headerStyle);  // Change the header
        ws.cell(1, 8).string('sub total').style(headerStyle);  // Change the header
        ws.cell(1, 9).string('qty').style(headerStyle);  // Change the header
        ws.cell(1, 10).string('total price').style(headerStyle);  // Change the header
        ws.cell(1, 11).string('Date | Time').style(headerStyle);  // Change the header
        ws.cell(1, 12).string('user_id').style(headerStyle);  // Change the header

        allproducts.reverse();

        for (let index = 0; index < allproducts.length; index++) {
          const product = allproducts[index];
          ws.cell(index + 2, 1).string(product.order_no);
          ws.cell(index + 2, 2).string(product.username);
          ws.cell(index + 2, 3).string(product.email);
          ws.cell(index + 2, 4).string(product.address);
          ws.cell(index + 2, 5).string(product.items);
          ws.cell(index + 2, 6).string(product.size);
          ws.cell(index + 2, 7).string(product.phone);
          ws.cell(index + 2, 8).string(product.sub_total);
          ws.cell(index + 2, 9).string(product.qty);
          ws.cell(index + 2, 10).string(product.total_price);
          ws.cell(index + 2, 11).string(product.created_at.toString());
          ws.cell(index + 2, 12).string(product.user_id.toString());
      }



        const formattedCreatedAt = DateTime.local().toFormat('yyyyMMddHHmmss');

        // Use a buffer to store the Excel data
        const excelBuffer = await wb.writeToBuffer();

        // Now that the buffer is ready, you can proceed to upload it to AWS S3
        const s3Key = `Product${formattedCreatedAt}.xlsx`;
        const uploadParams = {
          Bucket: 'clickycrmdev',
          Key: s3Key,
          Body: excelBuffer, // Use the buffer directly
          ACL: 'public-read',
          // Metadata: {
          //   // Add user_id as custom metadata
          //   user_id: data.user_id.toString(),
          // },
        };

        const uploadResponse = await S3.upload(uploadParams).promise();
        console.log('File uploaded to S3:', uploadResponse.Location);

        await GeneratedExcel.create({
          filename: s3Key,
          user_id: data.user_id,
      });

        // Delete records from the Product table after generating the file
        // await Product.truncate();

        // Update your job status if needed

        console.log('exporting xlxs completed at', new Date().toLocaleString());

      } catch (error) {
        console.error('Error exporting and clearing products:', error);
      }

      // Return any necessary data or status for reporting purposes
      return { success: true, message: 'Export completed' };
    } catch (error) {
      console.error('Error exporting and clearing products:', error);
      throw new Error('An error occurred while exporting and clearing products.');
    }
  }
}
