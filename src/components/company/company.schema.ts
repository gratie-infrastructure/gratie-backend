import { Schema, model, connect, Model } from 'mongoose';
import {ICompany} from '../company/company.interface'

const optSchema = new Schema<ICompany>({
  
  name: { required: true, type: String},
  email: {type: String},
  tier: {type: String},
  walletAddr: {type: String},
  companyNftId: {type: String}
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const Company: Model<ICompany> = model('Company', optSchema);
export default Company;