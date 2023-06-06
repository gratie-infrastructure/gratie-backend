import { Schema} from 'mongoose';

export default interface ITransaction {
    companyId: string| Schema.Types.ObjectId,
    transactionType: string,
    tokenCount: number,
    walletAddr: string
}