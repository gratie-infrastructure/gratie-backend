import { Types } from 'mongoose';

export interface IAuth {
    name: string,
    email: string,
    walletAddr: string,
    token: string
}
