import Bull from 'bull'
import {Job, Queue} from 'bull'
import * as console from 'console'

export interface QueuePayload {
  jobTitle: string
  delay?: number
  input?: any,
  repeat?: {
    cron: string
  }
}

export interface DataPayload {
  [key: string]: any;
}

export default class Queues {
  protected queue: Queue
  protected job: Job
  protected data: DataPayload

  constructor (payload: QueuePayload, data: DataPayload) {
    this.data = data
    this.queueable(payload).then(async () => {

      await this.queue.process(payload.jobTitle, this.handle.bind(this))
    })
  }

  public async queueable ({jobTitle, delay = 5000, repeat}: QueuePayload) {
    this.queue = new Bull(jobTitle)

    console.log('here is the job',jobTitle)


    this.job = await this.queue.add(jobTitle, {}, {
      delay,
      repeat,
    })
  }

  public handle () {
    console.log(this.job)
  }
}
