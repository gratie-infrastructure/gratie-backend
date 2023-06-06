import {Request, Response} from 'express';
import Util from '../../lib/util';
import User from './user.schema';
import { IUser } from './user.interface';

export default new class UserController {
    async listUser(req:Request, res:Response){
        try{
          const wallet_addr = req.body.wallet_addr;
          const user = await User.find({walletAddr: wallet_addr});
          return res.json({ data: user });
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }

      async listUsers(req:Request, res:Response){
        try{
          const user = await User.find();
          return res.json({ data: user });
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }
    
      async createUsers(req:Request, res:Response){
        try{
          const {name, email, status, tier, valuation, distributionPercentage, tokenName, tokenSymbol, walletAddr } = req.body;
          const exist:IUser = await User.findOne({email:email});
          console.log(exist);
          if(exist == null || !exist || exist == undefined){
            const user = await User.create({name:name, email:email, status:status, tier:tier, valuation:valuation, 
                distributionPercentage:distributionPercentage, tokenName:tokenName, tokenSymbol:tokenSymbol, walletAddr:walletAddr}); 
            return res.json({ data: user });
          }
          else{
            res.status(Util.status.internalError).json(Util.getErrorMsg('User Already Exist'));
          }
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }

    async saveToken(req:Request, res:Response){
        try{
          const token = req.body.token;
          const { _id } = req.app.locals.user;
          await User.updateOne({_id:_id}, {$set: {token:token}});
          return res.json({ msg: "added token" });
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }
}