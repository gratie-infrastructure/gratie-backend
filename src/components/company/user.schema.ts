import mongoose, {Schema, model, Model} from 'mongoose';
import {IUser} from './user.interface';

const optSchema = new Schema<IUser>({
  name: {required: true, type: String},
  email: {required: true, type: String},
  walletAddr: {type: String, required: true},
  companies: [
    {
      company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
      email: String,
      status: String,
    },
  ],
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const User: Model<IUser> = model('User', optSchema);
export default User;
