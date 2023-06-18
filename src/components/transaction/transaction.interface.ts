import {Schema, Types} from 'mongoose';

export default interface ITransaction {
    _id: Types.ObjectId,
    companyId?: Schema.Types.ObjectId,
    companyUserId?: Schema.Types.ObjectId,
    transactionType: string,
    metaData: JSON,
    walletAddr: string,
    transactionHash?: string,
};
