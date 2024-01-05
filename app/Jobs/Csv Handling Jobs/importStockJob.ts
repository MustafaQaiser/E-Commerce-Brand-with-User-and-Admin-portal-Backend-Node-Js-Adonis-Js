
import csvController from 'App/Controllers/Http/CsvController';
import Job from 'App/Models/Job';
import Stock from 'App/Models/Stock';
import Queues, {QueuePayload} from 'App/Modules/Queue';
import fs from 'fs'
import parse from 'papaparse';
import { jobrecords } from '../jobrecords';
export interface DataPayload {

    file:any,
    job_id:any

}
export interface Response {
  list?: any,
  props?: any,
}
export class importStockJob extends Queues {

  protected data: DataPayload
  public response: Response = {}
  public list: any = {}

  constructor(payload: QueuePayload, data: DataPayload) {
    super(payload, data);
  }

  public async handle() {
    const { file, job_id } = this.data
    console.log('data11111', file,job_id);
    const CsvController = new csvController();
    // console.log('csv start importing at ', new Date().toLocaleString());

const newFile = file;

    const results = [];
    const stream = fs.createReadStream(newFile.tmpPath);
console.log('stream',stream)
    const processingPromise = new Promise((resolve, reject) => {
      parse.parse(stream, {
        header: true,
        dynamicTyping: true,
        step: async (row: any) => {
          // results.push(row.data);

          results.push(row.data)
        },
        complete: async () => {
          try {
            const savedStocks = await Promise.all(results.map(async (row:any ) => {
              try {
                console.log('rowwww hhh',row)
                const savedStock = await Stock.create({
                  sku: row.variant,
                  stock_id: row.stock,
                });
                return savedStock;
              } catch (error) {
                console.error('Error saving stock:', error);
                return null;
              }
            }));

            const filteredStocks = savedStocks.filter(stock => stock !== null);
            console.log('Imported stocks:', filteredStocks.length);

            resolve({ message: 'CSV data imported and saved successfully.' });
          } catch (error) {
            console.error('Error importing CSV data:', error);
            reject({ error: 'An error occurred while importing CSV data.' });
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject({ error: 'An error occurred while parsing CSV data.' });
        },
      });
    });

    // try {
    //   const result = await processingPromise;
    //   return response.send(result);
    // } catch (error) {
    //   return response.status(500).json(error);
    // }


    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",job_id)
    // new jobrecords({jobTitle: 'jobrecords', delay:0},{data:
    //   job_id
    //  })

    const jb = await Job.query()
    .where('id', job_id).first();
    if(jb){


      await jb.merge({
        status: 'executed'
      }).save();
    }



    console.log('csv import completed', new Date().toLocaleString());

  }
}
