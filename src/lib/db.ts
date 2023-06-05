import {connect, connection} from 'mongoose';
import Util from '../lib/util';
import logger from '../lib/logger';
import {EventEmitter} from 'events';

const handleError = (err:any) => {
  err = err.message ? err.message : err;
  logger.error(err);
};

class DBEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

export const dbEmitter = new DBEmitter();

export const dbInit = async () => {
  try {
    const url:string = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;
    await connect(url).catch(Util.throwError);
    logger.info('Connected to DB server');
    dbEmitter.emit('dbConn');
  } catch (err) {
    handleError(err);
  }
  connection.on('error', (err) => {
    handleError(err);
  });
};
