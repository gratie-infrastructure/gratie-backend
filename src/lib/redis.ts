import {createClient, RedisClientOptions} from 'redis';
import logger from '../lib/logger';
const expireTime:number = parseInt(process.env.REDIS_KEY_EXPIRE) || 60 * 60 * 24;
const {REDIS_URL, REDIS_ENABLED, REDIS_CONNECTION_RETRY} = process.env;
type StatergyFun = ((retries: number, cause: Error) => false | Error | number);
type RedisClientType = ReturnType<typeof createClient>

export type RedisObjectType = Record<string, any>;

export default new class RedisClient {
  static _instrance:RedisClientType | null;
  client:RedisClientType;
  reconnectStatergy:StatergyFun;
  err: Error;
  constructor() {
    if (RedisClient._instrance) {
      this.client = RedisClient._instrance;
      return this;
    }
    this.reconnectStatergy = (retries:number) => this.retry(retries);
    this.client = this.create();
  }

  async init() {
    try {
      this.onConnect();
      this.onDisconnect();
      this.onError();
      this.onReconnect();
      await this.client.connect();
      RedisClient._instrance = this.client;
    } catch (err) {
      throw err;
    }
  }

  create() {
    const socket = {
      reconnectStrategy: this.reconnectStatergy,
    };
    const options:RedisClientOptions = {
      url: REDIS_URL,
      socket,
    };
    return createClient(options);
  }

  retry(retries:number) {
    logger.debug('[redis]:: Reconnectioning at ' + retries);
    if (retries > parseInt(REDIS_CONNECTION_RETRY)) throw new Error('retry limit exceed!');
    return retries+1;
  }

  onConnect() {
    this.client.on('connect', () => {
      logger.debug('[redis]:: connected at '+ REDIS_URL);
    });
  }

  onError() {
    this.client.on('error', (err) => {
      this.err = err;
      logger.error('[redis]::', err);
    });
  }

  onDisconnect() {
    this.client.on('end', () => {
      logger.error('[redis]:: disconnected');
    });
  }

  onReconnect() {
    this.client.on('reconnecting', () => {
      logger.info('[redis]::reconnecting');
    });
  }

  async setData(key:string, value:string|Record<string, any>, exp:number = expireTime) {
    try {
      if (this.isConnected() === false) return;
      value = JSON.stringify(value);
      logger.debug('[redis]::set::key: '+ key);
      logger.debug('[redis]::set::value: ' +value);
      return await this.client.set(key, value, {
        EX: exp,
      });
    } catch (err) {
      throw err;
    }
  }

  async getData(key:string) {
    try {
      if (this.isConnected() === false) return;
      const data = await this.client.get(key);
      logger.debug('[redis]::get::key: '+ key);
      logger.debug('[redis]::get::value: ' +data);
      return JSON.parse(data);
    } catch (err) {
      throw err;
    }
  }

  async removeData(key:string|string[]) {
    try {
      if (this.isConnected() === false) return;
      logger.debug('[redis]::remove: '+key);
      return await this.client.del(key);
    } catch (err) {
      throw err;
    }
  }

  async removeAllData() {
    try {
      if (this.isConnected() === false) return;
      const keys = await this.client.flushAll();
      logger.debug('[redis]::REMOVED ALL KEYS: ');
      return keys;
    } catch (err) {
      throw err;
    }
  }

  async hashSet(key:string, hash:RedisObjectType) {
    return await this.client.hSet(key, hash);
  }

  async hashGet(key:string) {
    return await this.client.hGetAll(key);
  }

  async addSortedData(key:string, score:number, member:RedisObjectType) {
    try {
      if (this.isConnected() === false) return;
      const _id = member._id.toString();
      const value = `${key}:${_id}`;
      member._id = member._id.toString();
      await this.hashSet(value, member);
      const keys = await this.client.zAdd(key, {score, value}, {INCR: true});
      logger.debug('[redis]::Added Sorted LIST with score ' + keys);
      return;
    } catch (err) {
      throw err;
    }
  }

  async updateSortedData(key:string, score:number, member:RedisObjectType) {
    try {
      if (this.isConnected() === false) return;
      const _id = member._id.toString();
      const value = `${key}:${_id}`;
      delete member._id;
      await this.hashSet(value, member);
      const keys = await this.client.zIncrBy(key, score, value);
      logger.debug('[redis]::Added Sorted LIST ' + keys);
      return;
    } catch (err) {
      throw err;
    }
  }

  async rangeCount(key:string) {
    try {
      return await this.client.zCard(key);
    } catch (err) {
      throw err;
    }
  }

  async getRangeData(key:string, start:number, end:number) {
    try {
      if (this.isConnected() === false) return;
      const keys = await this.client.zRange(key, start, end, {
        REV: true,
      });
      const __this = this;
      return await Promise.all(keys.map((key) => __this.hashGet(key)));
    } catch (err) {
      throw err;
    }
  }

  async scanKeys(pattern:string): Promise<string[]> {
    try {
      if (this.isConnected() === false) return;
      const ops = {
        MATCH: pattern,
        COUNT: 100,
      };
      const keys = [];
      for await (const key of this.client.scanIterator(ops) || []) {
        keys.push(key);
      }
      return keys;
    } catch (err) {
      throw err;
    }
  }

  async getUserRank(key:string, member:string) {
    try {
      if (this.isConnected() === false) return;
      return await this.client.zRevRank(key, member);
    } catch (err) {
      throw err;
    }
  }

  async getKeysByPattern(pattern:string) {
    try {
      if (this.isConnected() === false) return;
      const keys = await this.scanKeys(pattern);
      return keys;
    } catch (err) {
      throw err;
    }
  }

  isConnected():boolean {
    return REDIS_ENABLED && (REDIS_ENABLED === 'true');
  }
};

