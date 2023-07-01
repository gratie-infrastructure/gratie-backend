import mongoose, {Schema, model, Model, Types} from 'mongoose';
import {ICompany} from '../company/company.interface';

const optSchema = new Schema<ICompany>({
  name: {required: true, type: String},
  tokenId: {required: true, type: Number},
  email: {type: String},
  status: {type: String, enum: ['MINTED', 'APPROVED', 'PENDING', 'REJECTED']},
  tier: {type: String},
  valuation: {type: Types.Decimal128},
  distribution: {type: Types.Decimal128},
  tokenName: {type: String},
  tokenSymbol: {type: String},
  walletAddr: {type: String, required: true, unique: true},
  fileLocationHash: {type: String},
  rewardSignatureHash: {type: String},
  users: [
    {
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      status: String,
    },
  ],
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const Company: Model<ICompany> = model('Company', optSchema);
export default Company;
