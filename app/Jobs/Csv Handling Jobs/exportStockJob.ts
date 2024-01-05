
import csvController from 'App/Controllers/Http/CsvController';
import Stock from 'App/Models/Stock';
import Queues, {QueuePayload} from 'App/Modules/Queue';
import excel4node from 'excel4node';
import { DateTime } from 'luxon';
import GeneratedExcel from 'App/Models/GeneratedExcel';

// import { jobrecords } from '../jobrecords';
import Job from 'App/Models/Job';
export interface DataPayload {
  data: any,
}
export interface Response {
  list?: any,
  props?: any,
}
export class exportStockJob extends Queues {

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
        const allStocks = await Stock.all();
        const groupedStocks = {};

        // Group stocks by SKU
        allStocks.forEach(stock => {
            if (!groupedStocks[stock.sku]) {
                groupedStocks[stock.sku] = {
                    sku: stock.sku,
                    stock_ids: stock.stock_id.toString()
                };
            } else {
                groupedStocks[stock.sku].stock_ids += `|${stock.stock_id}`;
            }
        });

        const aggregatedStocks = Object.values(groupedStocks);

        const wb = new excel4node.Workbook();
        const ws = wb.addWorksheet('Stocks');

        const headerStyle = wb.createStyle({
            font: {
                bold: true,
            },
        });

        ws.cell(1, 1).string('SKU').style(headerStyle);
        ws.cell(1, 2).string('Stock IDs').style(headerStyle);  // Change the header

        aggregatedStocks.map((stock:any, index) => {
            ws.cell(index + 2, 1).string(stock.sku);
            ws.cell(index + 2, 2).string(stock.stock_ids);  // Change this to stock_ids
        });

        const formattedCreatedAt = DateTime.local().toFormat('yyyyMMddHHmmss');
        const tempFilePath = `Public/files/sample2${formattedCreatedAt}.xlsx`;
        wb.write(tempFilePath);



        await GeneratedExcel.create({
            filename: `sample2${formattedCreatedAt}.xlsx`,
            user_id: data.user_id,
        });

        // Delete records from the Stock table after generating the file
        await Stock.truncate();




    // new jobrecords({jobTitle: 'jobrecords', delay:1000},{data:data.id
    //  })
    const jb = await Job.query()
    .where('id', data.id).first();
    if(jb){


      await jb.merge({
        status: 'executed'
      }).save();
    }


        console.log('auto get shipper advice list completed', new Date().toLocaleString());

    } catch (error) {
        console.error('Error exporting and clearing stocks:', error);

    }

      // Return any necessary data or status for reporting purposes
      return { success: true, message: 'Export completed' };
    } catch (error) {
      console.error('Error exporting and clearing stocks:', error);
      throw new Error('An error occurred while exporting and clearing stocks.');
    }

  }


}
