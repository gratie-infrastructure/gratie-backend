import { Schema} from 'mongoose';

export interface IUser {
  name: string,
  email?: string,
  status?: string,
  walletAddr?: string,
  companyId?: Schema.Types.ObjectId
}