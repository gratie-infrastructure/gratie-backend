import {Schema, model, Model, Types} from 'mongoose';
import {ICompany} from '../company/company.interface';

const optSchema = new Schema<ICompany>({
  name: {required: true, type: String},
  email: {type: String},
  status: {type: String, enum: ['APPROVE', 'REJECT']},
  tier: {type: String},
  valuation: {type: Types.Decimal128},
  distribution: {type: Types.Decimal128},
  tokenName: {type: String},
  tokenSymbol: {type: String},
  walletAddr: {type: String, required: true},
  fileLocationHash: {type: String},
  users: [{type: String}],
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const Company: Model<ICompany> = model('Company', optSchema);
export default Company;
