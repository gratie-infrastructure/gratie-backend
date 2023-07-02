import {Request, Response} from 'express';
import Util from '../../lib/util';
import Company from './company.schema';
import User from './user.schema';
import TransactionService from '../transaction/transaction.service';
import Transaction from '../transaction/transaction.schema';
import {CONS} from '../../abstractions/constant';
import companyService from './company.service';
import generateSignature from './../../blockchain/generateSignature';
import {signParam} from './company.interface';

// const query: Record<string, any>[] = [
//   {
//     '$match': {
//       'walletAddr': '',
//     },
//   }, {
//     '$lookup': {
//       'from': 'users',
//       'localField': '_id',
//       'foreignField': 'companyId',
//       'as': 'result',
//     },
//   },
// ];

export default new class CompanyController {
  async createCompany(req: Request, res: Response) {
    try {
      const email = req.body?.email;
      if (!email) {
        throw new Error('Invalid Email Address');
      }
      const company = await Company.findOne({email: email});
      if (company) {
        throw new Error('CompanyUser Already Exist');
      }
      req.body['status'] = CONS.TRANSACTION.STATUS.minted;
      const CompanyData = await Company.create(req.body);
      // await this.createTransaction(req.body);
      // sendEmail(req.body);
      return res.json({data: CompanyData});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async updateCompany(req: Request, res: Response) {
    console.log('awalletAddr', req.body.walletAddr);
    try {
      const email = req.body?.email;
      if (!email) {
        throw new Error('Invalid Email Address1111');
      }
      const company = await Company.findOne({email: email});
      if (!company) {
        throw new Error('Company Not Exist');
      }
      if (company.status != CONS.TRANSACTION.STATUS.approved) {
        req.body['status'] = CONS.TRANSACTION.STATUS.pending;
      }
      await Company.findOneAndUpdate({walletAddr: req.body.walletAddr}, req.body);
      // sendEmail(req.body);
      return res.json({msg: 'Updated Sucessfully'});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async nftPurchase(req: Request, res: Response) {
    try {
      const signParams:signParam = {
        paymentMethod: req.body.paymentMethod,
        paymentAmount: req.body.paymentAmount,
        tierID: req.body.tierID,
        buyer: req.body.buyer,
      };
      const purchaseSignature:any = await generateSignature(signParams);
      if (purchaseSignature.error) {
        throw new Error(purchaseSignature.message);
      }
      return res.json({purchaseSignature: purchaseSignature.data.signature});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async userApproval(req: Request, res: Response) {
    companyService.approveBulkUsers(req.body);
    return res.json({purchaseSignature: 'sfgsdfg234234111111'});
  }

  async addUser(req: Request, res: Response) {
    try {
      const {walletAddr, email, companyId} = req.body;
      if (!walletAddr) {
        throw new Error('Invalid walletAddr');
      }
      console.log('email', email);
      console.log('walletAddr', walletAddr);
      const company:any = await Company.findOne({_id: companyId});
      if (!company) {
        throw new Error('Company Not Exist');
      }
      // eslint-disable-next-line no-var
      var user:any = await User.findOne({'walletAddr': walletAddr, 'companies.company': company._id});
      if (user) {
        throw new Error('User Already Exist Under Company111');
      } else {
        user = await User.findOne({walletAddr});
        const companies:[{}] = user ? user.companies : [];
        companies.push({
          company: company._id,
          email: email,
          status: CONS.TRANSACTION.STATUS.pending,
        });
        if (user) {
          const userUpdated = await User.updateOne({walletAddr: walletAddr}, {companies: companies});
          console.log('userUpdated', userUpdated);
          user = await User.findOne({walletAddr: walletAddr});
        } else {
          req.body.companies = companies;
          user = await User.create(req.body);
        }
        // const companyUsers:[{}] = company ? company.users : [];
        // companyUsers.push({
        //   id: user._id,
        //   status: 'PENDING',
        // });
        await Company.updateOne(
            {_id: company._id},
            {$push: {users: {user: user._id, status: CONS.TRANSACTION.STATUS.pending}}},
        );
      }
      // sendUserEmail(req.body);
      return res.json({data: user});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async getCompany(req: Request, res: Response) {
    try {
      const walletAddr = req.query.walletAddr;
      const company = await Company.findOne({walletAddr: walletAddr});
      if (company) {
        return res.json({data: company});
      } else {
        throw new Error('Company Not found');
      }
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async getAllCompany(req: Request, res: Response) {
    try {
      const status = req.query.status ? req.query.status : CONS.TRANSACTION.STATUS.pending;
      const companies = await Company.find({status: status});
      if (companies) {
        return res.json({data: companies});
      } else {
        throw new Error('Company Not found');
      }
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const {walletAddr, status} = req.query;

      const users = await Company.aggregate([
        {$match: {walletAddr: walletAddr}},
        {$unwind: '$users'},
        {$match: {'users.status': status}},
        {
          $lookup: {
            from: 'users',
            localField: 'users.user',
            foreignField: '_id',
            as: 'allUsers',
          },
        },
        {$unwind: '$allUsers'},
        {
          $project: {
            'allUsers.companies': 0,
          },
        },
        {
          $group: {
            _id: '$_id',
            name: {$first: '$name'},
            tokenId: {$first: '$tokenId'},
            email: {$first: '$email'},
            users: {$push: '$allUsers'},
          },
        },
      ]);

      console.log('users', users);
      return res.json({data: users});
    } catch (err) {
      console.log(err);
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async listCompanies(req: Request, res: Response) {
    try {
      const {walletAddr} = req.query;

      const companies = await User.aggregate([
        {$match: {'walletAddr': walletAddr}},
        {$unwind: '$companies'},
        {
          $lookup: {
            'from': 'companies',
            'localField': 'companies.company',
            'foreignField': '_id',
            'as': 'companyInfo',
          },
        },
        {
          $project: {
            'companyInfo.companies': 0,
          },
        },
        {
          $unwind: '$companyInfo',
        },
        {
          $group: {
            _id: '$_id',
            name: {$first: '$name'},
            email: {$first: '$email'},
            companies: {$push: '$companyInfo'},
          },
        },
        {
          $project: {
            'companies.users': 0,
          },
        },
      ]);

      console.log('users', companies);
      return res.json({data: companies});
    } catch (err) {
      console.log(err);
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async mintToken(req: Request, res: Response) {
    try {
      const args = req.body;
      args.metaData = {
        rewardTokenAmount: req.body.rewardTokenAmount,
        rewardCycleId: req.body.rewardCycleId,
      },
      args.transactionType = CONS.TRANSACTION.TYPE.nftMintCompany;
      const transaction = await TransactionService.createTransaction(args);
      return res.json({data: transaction});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async createTransaction(options:any) {
    return await Transaction.create(options);
  }


  async transaction(req: Request, res: Response) {
    try {
      const walletAddr = req.body.walletAddr;
      const data = await Transaction.find({walletAddr: walletAddr});
      return res.json({transaction: data});
    } catch (err) {
      console.log(err);
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }
};


