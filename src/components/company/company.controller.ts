import {Request, Response} from 'express';
import Util from '../../lib/util';
import Company from './company.schema';
import { ICompany } from './company.interface';
import Transaction from '../transaction/transaction.schema';

export default new class CompanyController {
    
      async createCompanyUsers(req:Request, res:Response){
        try{
          const {name, email, status, tier, walletAddr } = req.body;
          const exist:ICompany = await Company.findOne({email:email});
          console.log(exist);
          if(exist == null || !exist || exist == undefined){
            const CompanyData = await Company.create({name:name, email:email, status:status, tier:tier, walletAddr:walletAddr}); 
            return res.json({ data: CompanyData });
          }
          else{
            res.status(Util.status.internalError).json(Util.getErrorMsg('CompanyUser Already Exist'));
          }
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }

      async listUsers(req:Request, res:Response){
        try{
          const walletAddr = req.body.walletAddr;
          const user = await Company.find({walletAddr: walletAddr});
          return res.json({ data: user });
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }

    async transaction(req:Request, res:Response){
        try{
          const walletAddr = req.body.walletAddr;
          const data = await Transaction.find({walletAddr: walletAddr});
          return res.json({ transaction: data });
        } catch(err) {
          console.log(err);
          res.status(Util.status.internalError).json(Util.getErrorMsg(err));
        }
      }
}