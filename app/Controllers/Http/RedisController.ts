import { tryCatch } from 'bullmq';
import Redis from 'ioredis';

class RedisController {
  async redis({ request ,response }) {
    const {name}=request.only(['name'])
    console.log(name)
    const redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });

    try {

      const redisKeys = await redis.keys(`*`);

      if (redisKeys !== null && redisKeys.length > 0) {
        return response.status(200).json({ keys: redisKeys,totallength:redisKeys.length });
      } else {

        return response.status(404).json({ error: 'No keys found in Redis.' });
      }
    } catch (error) {

      console.error('Error:', error);
      return response.status(500).json({ error: 'An error occurred while retrieving data from Redis.' });
    }
  }

  async redisLength({ request ,response }) {
    const {name}=request.only(['name'])
    console.log(name)
    const redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });

    try {

      const redisKeys = await redis.keys(`${name}*`);

      if (redisKeys !== null && redisKeys.length > 0) {

        return response.status(200).json({ keys: redisKeys });
      } else {

        return response.status(404).json({ error: 'No keys found in Redis.' });
      }
    } catch (error) {

      console.error('Error:', error);
      return response.status(500).json({ error: 'An error occurred while retrieving data from Redis.' });
    }
  }

  async redissingle({request, response }) {
    const key=request.only(['key'])
    console.log(key.key)
    const redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });

    try {

      const redisKey = key.key;

      const redisData = await redis.hgetall(redisKey);

      if (redisData !== null && Object.keys(redisData).length > 0) {

        return response.status(200).json({ data: redisData });
      } else {

        return response.status(404).json({ error: 'Data not found in Redis.' });
      }
    } catch (error) {

      console.error('Error:', error);
      return response.status(500).json({ error: 'An error occurred while retrieving data from Redis.' });
    }
  }
  async job({response}){
    try {
      response.send(['exportStockJob','importStockJob'])
    } catch (error) {

    }
  }

}

export default RedisController;
