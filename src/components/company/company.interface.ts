import {Types} from 'mongoose';

export interface ICompany {
    _id: Types.ObjectId,
    name: string,
    email: string,
    status:string,
    tier: string,
    valuation?: Types.Decimal128,
    distribution?: Types.Decimal128,
    tokenName?: string,
    tokenSymbol?: string,
    walletAddr: string,
    fileLocationHash?: string,
    users?: [string]
}

export interface CompanyApproveParam {
    walletAddresses:[],
    companyWalletAddr:string,
    status:string,
    transactionHash:string
}
