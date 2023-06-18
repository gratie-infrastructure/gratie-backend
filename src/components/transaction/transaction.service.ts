// /* eslint-disable new-cap */

// import Util from '../../lib/util';
// import logger from '../../lib/logger';
import Transaction from './transaction.schema';
import ITransaction from './transaction.interface';

export default new class TransactionService {
  createTransaction = async (args: ITransaction) => {
    await Transaction.create(args);
  };
};
