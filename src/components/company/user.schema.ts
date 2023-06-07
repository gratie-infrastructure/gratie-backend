import { Schema, model, connect, Model } from 'mongoose';
import {IUser} from './user.interface';

const optSchema = new Schema<IUser>({
  
  name: { required: true, type: String},
  email: {type: String},
  status: {type: String, enum: ['APPROVE', 'REJECT']},
  walletAddr: {type: String},
  companyId: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: "Company"
  }
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const User: Model<IUser> = model('User', optSchema);
export default User;