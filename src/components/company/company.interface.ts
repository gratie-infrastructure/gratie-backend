import { Types } from 'mongoose';

export interface ICompany {
    name: string,
    email: string,
    status:string,
    tier: string,
    valuation?: Types.Decimal128,
    distribution?: Types.Decimal128,
    tokenName?: string, 
    tokenSymbol?: string,
    walletAddr: string,
    fileLocationHash?: string
}
