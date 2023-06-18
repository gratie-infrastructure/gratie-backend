import {Schema, model, Model} from 'mongoose';
import {IUser} from './user.interface';

const optSchema = new Schema<IUser>({
  name: {required: true, type: String},
  email: {required: true, type: String},
  status: {type: String, enum: ['APPROVE', 'REJECT']},
  walletAddr: {type: String, required: true},
  companies: [{type: String}],
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const User: Model<IUser> = model('User', optSchema);
export default User;
