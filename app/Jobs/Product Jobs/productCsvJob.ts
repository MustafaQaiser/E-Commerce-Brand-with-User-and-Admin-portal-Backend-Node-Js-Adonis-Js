
import csvController from 'App/Controllers/Http/CsvController';
// import Job from 'App/Models/Job';
import Product from 'App/Models/Product';

import Queues, {QueuePayload} from 'App/Modules/Queue';
import fs from 'fs'
import parse from 'papaparse';
import fs1 from 'fs/promises'; // For promises-based file operations
import XLSX from 'xlsx';
import Job from 'App/Models/Job';


export interface DataPayload {

    file:any,
    job_id:any,
    user_id:any

}
export interface Response {
  list?: any,
  props?: any,
}
export class productCsvJob extends Queues {

  protected data: DataPayload
  public response: Response = {}
  public list: any = {}

  constructor(payload: QueuePayload, data: DataPayload) {
    super(payload, data);
  }

  public async handle() {
    const { file, job_id ,user_id} = this.data
    // console.log('data11111', file,job_id);
    const CsvController = new csvController();





try {
  const workbook = await XLSX.readFile(file.tmpPath);

  // Assuming you want to read the first sheet in the Excel file
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const results: Product[] = [];
let count=0;
  XLSX.utils.sheet_to_json(worksheet).forEach(async (row:any) => {
    count++;
    try {
      const savedProduct = await Product.create({
        user_id,
        order_no: row['Order No'],
        username: row['Username'],
        email: row['Email'],
        address: row['Address'],
        items: row['Items'],
        size: row['size'],
        phone: row['Phone'],
        sub_total: row['sub total'],
        qty: row['qty'],
        total_price: row['total price'],
        date_time: row['Date | Time'],
      });

      results.push(savedProduct);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  });
  const rows = XLSX.utils.sheet_to_json(worksheet);
  console.log('Imported products:', rows.length);
     const jb = await Job.query()
    .where('id', job_id).first();
    if(jb){


      await jb.merge({
        status: 'executed'
      }).save();
    }



    console.log('XLXS Data import completed', new Date().toLocaleString());
  return { message: 'XLSX data imported and saved successfully.' };
} catch (error) {
  console.error('Error importing XLSX data:', error);
  throw new Error('An error occurred while importing XLSX data.');
}





  }
}
