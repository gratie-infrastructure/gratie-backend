import { Schema, model, Model } from 'mongoose';
import ITransaction from './transaction.interface';

const transactionSchema = new Schema<ITransaction>({
    companyId: { ref:'Company', required: true, type: Schema.Types.ObjectId },
    transactionType: { required: true, type: String, enum:['WITHDRAW', 'DEPOSIT'] },
    tokenCount: { ref:'User', required: true, type: Number },
    walletAddr: {type: String}
}, {timestamps: true});
  
const Transaction:Model<ITransaction> = model('Transaction', transactionSchema);  
export default Transaction;