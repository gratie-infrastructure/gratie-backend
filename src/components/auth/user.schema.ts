import { Schema, model, connect, Model } from 'mongoose';
import {IUser} from './user.interface';

const optSchema = new Schema<IUser>({
  
  name: { required: true, type: String},
  email: {type: String},
  lastLoginAt: Date,
  status: {type: String, enum:['Approve', 'reject']},
  tier: {type: String},
  valuation: {type: String},
  distributionPercentage : {type: String},
  token:{type: String},
  tokenName: {type: String},
  tokenSymbol: {type: String},
  walletAddr: {type: String},
  companyNftId: {type: String}
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const User: Model<IUser> = model('User', optSchema);
export default User;