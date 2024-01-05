import Queues, { QueuePayload } from 'App/Modules/Queue';
import Job from 'App/Models/Job';
// import AWS from 'aws-sdk';
import S3 from '../../awsconfig'

export interface DataPayload {
  s3Key: string; // Pass the S3 key instead of 'file'
  job_id: any;
}

export interface Response {
  list?: any;
  props?: any;
}

export class downloadXlxsjob extends Queues {
  protected data: DataPayload;
  public response: Response = {};
  public list: any = {};

  constructor(payload: QueuePayload, data: DataPayload) {
    super(payload, data);
  }

  public async handle() {
    const { s3Key, job_id } = this.data;

console.log(s3Key)

    // Configure AWS SDK

// AWS.config.update({
//   accessKeyId: 'AKIAU5752QMZHQE7QHIB',
//   secretAccessKey: '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',
//   region: 'me-south-1',
// });


    // Create an S3 object
    // const s3 = new AWS.S3();

    try {
      // Create parameters for the getObject call
      const s3Params = {
        Bucket: 'clickycrmdev', // Replace with your S3 bucket name
        Key: s3Key,
      };

      // Get the file from S3
      const s3Response = await S3.getObject(s3Params).promise();

      if (s3Response.Body) {
        // Set appropriate headers for the file response
        // response.header('Content-Type', s3Response.ContentType);
        // response.header('Content-Disposition', `attachment; filename="${s3Key}"`);

        // Send the file to the frontend


        // Update the job status
        const jb = await Job.query().where('id', job_id).first();
        if (jb) {
          await jb.merge({
            status: 'executed',
          }).save();
        }

        console.log('File downloaded successfully.');
        return (s3Response.Body);
      } else {
        console.error('Empty file received from S3.');
        return ({ error: 'Empty file received from S3.' });
      }
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      return ({ error: 'An error occurred while downloading the file.' });
    }
  }
}
