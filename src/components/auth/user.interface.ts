import { Schema} from 'mongoose';

export interface IUser {
  name: string,
  email?: string,
  lastLoginAt?: Date,
  status?: string,
  tier?: string,
  valuation?: string,
  distributionPercentage?: string,
  token?: string,
  tokenName?: string,
  tokenSymbol?: string,
  walletAddr?: string,
  companyNftId?: string
}