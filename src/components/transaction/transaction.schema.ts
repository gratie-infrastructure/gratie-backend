import {Schema, model, Model} from 'mongoose';
import ITransaction from './transaction.interface';

const transactionSchema = new Schema<ITransaction>({
  companyId: {type: Schema.Types.ObjectId, required: true},
  companyUserId: {type: Schema.Types.ObjectId},
  transactionType: {required: true, type: String},
  metaData: {type: JSON},
  walletAddr: {type: String},
  transactionHash: {type: String},
}, {timestamps: true});

const Transaction:Model<ITransaction> = model('Transaction', transactionSchema);
export default Transaction;
