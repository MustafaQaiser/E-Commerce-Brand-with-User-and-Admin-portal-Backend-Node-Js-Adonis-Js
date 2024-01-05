
import AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: 'AKIAU5752QMZHQE7QHIB',
  secretAccessKey: '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',
  region: 'me-south-1',
});

const S3 = new AWS.S3();

export default   S3;
