import {Schema, model, Model} from 'mongoose';
import {IUser} from './user.interface';

const optSchema = new Schema<IUser>({
  name: {required: true, type: String},
  email: {required: true, type: String},
  walletAddr: {type: String, required: true},
  companies: [{
    id: {type: Schema.Types.ObjectId, required: true},
    email: {required: true, type: String},
    status: {type: String, enum: ['APPROVED', 'REJECTED', 'SUSPENDED']},
  }],
}, {timestamps: true});

// export default model<IUser>('User', optSchema);

const User: Model<IUser> = model('User', optSchema);
export default User;
