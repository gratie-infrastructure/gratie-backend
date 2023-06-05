import logger from './logger';

export const Util = {
  throwError: (err:Error | string) => {
    throw err;
  },
  status: {
    internalError: 500,
    notFound: 404,
    unAuthorized: 401,
    forbidden: 403,
    ok: 200,
    created: 201,
    NO_CONTANT: 204,
  },
  parseErr: (err: Error) => {
    logger.error(err.stack);
    return err.message;
  },
  getErrorMsg: (err: Error | string) => {
    if (typeof err === 'string') {
      return {msg: err};
    } else {
      return {msg: Util.parseErr(err)};
    }
  },
};

export default Util;
