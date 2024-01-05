// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Stock from "App/Models/Stock";
// import parse from 'papaparse';
// import { DateTime } from 'luxon';
import fs from 'fs'
// const excel4node = require('excel4node');
import GeneratedExcel from "App/Models/GeneratedExcel";
import path from 'path';
import Env from '@ioc:Adonis/Core/Env';
import { google } from 'googleapis';
// import {QueuePayload} from 'App/Modules/Queues'
// import Queue from "App/Modules/Queue";

import { importStockJob } from "App/Jobs/Csv Handling Jobs/importStockJob";
import { exportStockJob } from "App/Jobs/Csv Handling Jobs/exportStockJob";
import Job from "App/Models/Job";
// import { jobrecords } from "App/Jobs/jobrecords";
import { productCsvJob } from "App/Jobs/Product Jobs/productCsvJob";
import { exportJob } from "App/Jobs/Product Jobs/exportJob";
import Product from "App/Models/Product";
import { downloadXlxsjob } from "App/Jobs/Product Jobs/downloadXlxsJob";
import { tryCatch } from "bullmq";
// const queue = new Bull('import_csv');
export default class CsvsController {

    public MODEL :typeof Stock
    public GENERATE_EXCEL :typeof GeneratedExcel
    public Job:typeof Job

    public async importcsv({ request, response }) {



      const file = request.file('csv');
      // new jobrecords({jobTitle: 'jobrecords', delay:1000},{data:{
      //   job_name:'importStockJob',
      //   delay:10000
      // }})
      const jb=new Job;
      jb.job_name='importStockJob';
      jb.status='initiated';

      await jb.save();


      if (!file) {
        return response.status(400).json({ error: 'CSV file not provided' });
      }

      // const results = [];
      // const stream = fs.createReadStream(file.tmpPath);
      // const payload: QueuePayload = {
      //   jobTitle: 'import_csv', // Use a meaningful job title
      //   input: stream, // Pass the data to the job
      // };

      try {
console.log(jb.id)
       new importStockJob({jobTitle: 'importStockJob', delay:3000}, {
        file:file,
        job_id:jb.id
      })
        return response.send({ message: 'CSV data enqueued for processing.' });
      } catch (error) {
        console.error('Error enqueuing CSV data:', error);
        return response.status(500).json({ error: 'An error occurred while enqueuing CSV data.' });
      }

      // const processingPromise = new Promise((resolve, reject) => {
      //   parse.parse(stream, {
      //     header: true,
      //     dynamicTyping: true,
      //     step: async (row: any) => {
      //       // results.push(row.data);

      //       results.push(row.data)
      //     },
      //     complete: async () => {
      //       try {
      //         const savedStocks = await Promise.all(results.map(async (row:any ) => {
      //           try {
      //             const savedStock = await Stock.create({
      //               sku: row.variant,
      //               stock_id: row.stock,
      //             });
      //             return savedStock;
      //           } catch (error) {
      //             console.error('Error saving stock:', error);
      //             return null;
      //           }
      //         }));

      //         const filteredStocks = savedStocks.filter(stock => stock !== null);
      //         console.log('Imported stocks:', filteredStocks.length);

      //         resolve({ message: 'CSV data imported and saved successfully.' });
      //       } catch (error) {
      //         console.error('Error importing CSV data:', error);
      //         reject({ error: 'An error occurred while importing CSV data.' });
      //       }
      //     },
      //     error: (error) => {
      //       console.error('Error parsing CSV:', error);
      //       reject({ error: 'An error occurred while parsing CSV data.' });
      //     },
      //   });
      // });

      // try {
      //   const result = await processingPromise;
      //   return response.send(result);
      // } catch (error) {
      //   return response.status(500).json(error);
      // }


    }

    public async importProductCsv({ request, response , params}) {


      const {id}=params;
      const file = request.file('csv');
      // new jobrecords({jobTitle: 'jobrecords', delay:1000},{data:{
      //   job_name:'importStockJob',
      //   delay:10000
      // }})
      const jb=new Job;
      jb.job_name='productCsvJob';
      jb.status='initiated';

      await jb.save();


      if (!file) {
        return response.status(400).json({ error: 'CSV file not provided' });
      }


      try {

       new productCsvJob({jobTitle: 'productCsvJob', delay:30000}, {
        file:file,
        job_id:jb.id,
        user_id:id
      })
        return response.send({ message: 'xlxs data enqueued for processing.' });
      } catch (error) {
        console.error('Error enqueuing CSV data:', error);
        return response.status(500).json({ error: 'An error occurred while enqueuing CSV data.' });
      }
    }
    public async exportStocks({ request, response }) {
      try {
        const { user_id } = request.only(['user_id']);

        const jb=new Job;
        jb.job_name='exportStockJob';
        jb.status='initiated';

        await jb.save();


        // new jobrecords({jobTitle: 'jobrecords', delay:1000},{data:{
        //   job_name:'exportStockJob',
        //   delay:1000
        // }})
        // const job = await Job.query()
        // .where('job_name', 'exportStockJob').first();

        // console.log(job)
        // if(job){


        //   await job.merge({
        //     executed: job.executed +1
        //   }).save();
        // }
        // else{
        //   const jb=new Job;
        //   jb.job_name='exportStockJob';
        //   jb.executed=1;
        //   jb.delay=1000;
        //   await jb.save();
        // }


        new exportStockJob({jobTitle: 'exportStockJob', delay:10000},{data:
         {user_id: user_id,
          id:jb.id
        }
        })
        return response.send({ message: 'CSV exporting in process' });


//         const stockExportService = new StockExportService();
//         const result = await stockExportService.exportStocks(user_id);

// console.log(result)
          // response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          // response.header('Content-Disposition', 'attachment; filename=exported_stocks.xlsx');
          // response.send("Csv Generated");
      } catch (error) {
          console.error('Error exporting and clearing stocks:', error);
          response.status(500).json({ error: 'An error occurred while exporting and clearing stocks.' });
      }
  }





    public async getuserresults({ request, response }) {

        try {
          const { user_id } = request.only(['user_id']);
          console.log(user_id)
          // Retrieve the generated Excel file based on the provided id

          const generatedExcel = await GeneratedExcel.query().where('user_id',user_id);
          // const generatedExcel = await GeneratedExcel.filter(user_id => 'user_id'==user_id);


          if (!generatedExcel) {
            return response.status(404).json({ message: 'Generated Excel file not found.' });
          }

          // Set response headers for sending the XLSX file
          response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          // response.header('Content-Disposition', `attachment; filename="${generatedExcel.filename}"`);

          // Send the file content as the response
          return response.send(generatedExcel);
        } catch (error) {
          console.error('Error fetching the generated Excel:', error);
          return response.status(500).json({ error: 'An error occurred while fetching the generated Excel.' });
        }
      }
    //   try {
    //     // Retrieve the first generated Excel file from the database


    //     const firstGeneratedExcel = await GeneratedExcel.query().orderBy('id', 'asc').first();

    //     if (!firstGeneratedExcel) {
    //       return response.status(404).json({ message: 'No generated Excel files found.' });
    //     }

    //     // Set response headers for sending the XLSX file
    //     response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     response.header('Content-Disposition', `attachment; filename="${firstGeneratedExcel.filename}"`);

    //     // Send the file content as the response
    //     return response.send('downloading');
    //   } catch (error) {
    //     console.error('Error fetching the first generated Excel:', error);
    //     return response.status(500).json({ error: 'An error occurred while fetching the first generated Excel.' });
    //   }
    // }
    // public async downloadFile({ request, response }) {
    //   try {
    //     const { filename } = request.only(['filename']);
    //     const filePath = path.join('Public/files/', filename);

    //     // Check if the file exists
    //     if (fs.existsSync(filePath)) {
    //       // Set appropriate headers for the file response
    //       response.header('Content-Disposition', `attachment; filename="${filename}"`);
    //       response.download(filePath);
    //     } else {
    //       return response.status(404).json({ message: 'File not found.' });
    //     }
    //   } catch (error) {
    //     console.error('Error downloading file:', error);
    //     return response.status(500).json({ error: 'An error occurred while downloading the file.' });
    //   }
    // }






    public async exportProduct({ request, response }) {
      try {
        const { user_id } = request.only(['user_id']);

        const jb=new Job;
        jb.job_name='exportProductJob';
        jb.status='initiated';

        await jb.save();





        new exportJob({jobTitle: 'exportProductJob', delay:3000},{data:
         {user_id: user_id,
          id:jb.id
        }
        })
        return response.send({ message: 'xlxs exporting in process' });



      } catch (error) {
          console.error('Error exporting and clearing product:', error);
          response.status(500).json({ error: 'An error occurred while exporting and clearing product.' });
      }
  }



  public async updateProduct({ request, response, params }) {
    try {

      const { id } = params;
      const {data} = request.only([ 'address' ,'items', 'size', 'phone' ,'sub_total' ,'total_price']);

      const product = await Product.find(id);

      if (!product) {
        return response.send({
          success: false,
          message: `product with ID ${id} not found.`,
        });
      }


      product.address = data.address;
      product.items = data.items;
      product.size = data.size;
      product.phone = data.phone;
      // Update the product properties
      product.sub_total = data.sub_total;

      // Convert the result back to a string and store it
      product.total_price = parseInt(product.sub_total.toString()) * parseInt(product.qty.toString());



      // Uncomment the following if you need to handle password updates


      await product.save();


      return response.send({
        success: true,
        message: `product with ID ${id} has been updated successfully.`,
      });

    } catch (err) {
      return response.status(500).send({
        success: false,
        message: err.message,
      });
    }
  }


  public async downloadFile({ request, response }) {
    try {
      const { filename } = request.only(['filename']);
      const jb=new Job;
      jb.job_name='downloadFiles';
      jb.status='initiated';

      await jb.save();


      new downloadXlxsjob({jobTitle: 'downloadXlxsjob', delay:4000}, {
        s3Key:filename,
        job_id:jb.id
      })
     return response.send('downloading in process')
    } catch (error) {
      console.error('Error downloading file:', error);
      return response.status(500).json({ error: 'An error occurred while downloading the file.' });
    }
  }
async viewProducts({response,params}){


  const {id}=params;
  try {
    const allproducts = await Product.query()
    .where('user_id', id)



    // allproducts.reverse();

    if(!allproducts){
      return response.send('no products fround')
    }
    response.send(allproducts,allproducts.length)

  } catch (error) {
    return response.send(error)
  }
}



  }



