import { Request, Response } from 'express';
import Util from '../../lib/util';
import Company from './company.schema';
import User from './user.schema';
import Transaction from '../transaction/transaction.schema';
import { sendEmail, sendUserEmail } from '../../lib/nodemailer';


const query: Record<string, any>[] = [
  {
    '$match': {
      'walletAddr': ''
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': '_id', 
      'foreignField': 'companyId', 
      'as': 'result'
    }
  }
]

export default new class CompanyController {

  async createCompanyUsers(req: Request, res: Response) {
    try {
      const email = req.body?.email;
      if (!email) {
        throw new Error('Invalid Email Address');
      }
      const company = await Company.findOne({ email: email });
      if (company) {
        throw new Error('CompanyUser Already Exist');
      }
      const CompanyData = await Company.create(req.body);
      await this.createTransaction(req.body);
      // sendEmail(req.body);
      return res.json({ data: CompanyData });
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async updateCompanyUser(req: Request, res: Response) {
    console.log("awalletAddr", req.body.walletAddr);
    try {
      const email = req.body?.email;
      if (!email) {
        throw new Error('Invalid Email Address');
      }
      const company = await Company.findOne({ email: email });
      if (!company) {
        throw new Error('Company Not Exist');
      }
      const CompanyData = await Company.findOneAndUpdate({walletAddr: req.body.walletAddr}, req.body);
      // sendEmail(req.body);
      return res.json({ data: CompanyData });
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async nftPurchase(req: Request, res: Response) {
    return res.json({ purchaseSignature: 'sfgsdfg234234' });
  }

  async userApproval(req: Request, res: Response) {
    return res.json({ purchaseSignature: 'sfgsdfg234234' });
  }

  async addUser(req: Request, res: Response) {
    try {
      const {email, companyId} = req.body;
      if (!email) {
        throw new Error('Invalid Email Address');
      }
      const company = await User.findOne({ email, companyId });
      if (company) {
        throw new Error('User Already Exist Under Company');
      }
      const CompanyData = await User.create(req.body);
      sendUserEmail(req.body);
      return res.json({ data: CompanyData });
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const walletAddr = req.body.walletAddr;
      const user = await Company.aggregate([
        {
          '$match': {
            'walletAddr': walletAddr
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': '_id', 
            'foreignField': 'companyId', 
            'as': 'result'
          }
        }
      ]);
      return res.json({ data: user });
    } catch (err) {
      console.log(err);
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async mintToken(req: Request, res: Response) {
    try {
      const {body} = req;
      const transaction = await Transaction.create(body);
      return res.json({ data: transaction});
    } catch(err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async createTransaction(options:any) {
    return await Transaction.create(options);
  }


  async transaction(req: Request, res: Response) {
    try {
      const walletAddr = req.body.walletAddr;
      const data = await Transaction.find({ walletAddr: walletAddr });
      return res.json({ transaction: data });
    } catch (err) {
      console.log(err);
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }
}


