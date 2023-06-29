// /* eslint-disable new-cap */

import {CompanyApproveParam, ICompany} from './company.interface';
import User from './user.schema';
import {CONS} from '../../abstractions/constant';
import Company from './company.schema';
import {IUser} from './user.interface';
import TransactionService from './../transaction/transaction.service';


export default new class CompanyService {
  approveUser = async (args: CompanyApproveParam) => {
    const company:ICompany = await Company.findOne({walletAddr: args.companyWalletAddr});
    const users:any = company.users || [];
    args.walletAddresses.forEach(async (walletAddr:string) => {
      const company:ICompany = await Company.findOne({walletAddr: args.companyWalletAddr});
      await User.findOneAndUpdate(
          {walletAddr: walletAddr, companyId: company._id},
          {status: CONS.TRANSACTION.STATUS.approved},
      );
      const user:IUser = await User.findOne({walletAddr: walletAddr});
      if (user && !users.includes(user._id.toString())) {
        users.push(user._id.toString());
        await Company.findOneAndUpdate({_id: company._id}, {users: users});
      }
    });
    return true;
  };

  signAndApprove = async (args: any) => {
    const allowedAdmin = process.env.ADMIN_WALLET_ADDRESS;
    if (!allowedAdmin.includes(args.walletAddr)) {
      throw new Error('Admin only allowed for this action');
    }
    const company:ICompany = await Company.findOne({_id: args.companyId});
    if (!company) {
      throw new Error('Company not found');
    }
    await Company.findOneAndUpdate({_id: company._id}, {
      status: CONS.TRANSACTION.STATUS.approved,
      rewardSignatureHash: 'sdfsdf12323',
    });
    args.metaData = {
      rewardSignatureHash: args.rewardSignatureHash,
    },
    args.transactionType = CONS.TRANSACTION.TYPE.companyApproval;
    await TransactionService.createTransaction(args);
    return true;
  };
};
