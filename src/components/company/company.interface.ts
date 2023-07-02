import {Types} from 'mongoose';

export interface ICompany {
    _id: Types.ObjectId,
    tokenId: number,
    name: string,
    email: string,
    status: string,
    tier: string,
    valuation?: Types.Decimal128,
    distribution?: Types.Decimal128,
    tokenAddr?: string,
    tokenName?: string,
    tokenSymbol?: string,
    tokenIconUrl?:string,
    walletAddr: string,
    fileLocationHash?: string,
    rewardSignatureHash?: string,
    users?: [string]
}

export interface CompanyApproveParam {
    walletAddresses:[],
    companyWalletAddr:string,
    status:string,
    transactionHash:string
}

export interface signParam {
    paymentMethod: string,
    paymentAmount: bigint,
    tierID: string,
    buyer: string,
}
