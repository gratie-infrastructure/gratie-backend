// /* eslint-disable new-cap */

import {CompanyApproveParam, ICompany} from './company.interface';
import User from './user.schema';
import {CONS} from '../../abstractions/constant';
import Company from './company.schema';
import {IUser} from './user.interface';


export default new class CompanyService {
  approveUser = async (args: CompanyApproveParam) => {
    const company:ICompany = await Company.findOne({walletAddr: args.companyWalletAddr});
    const users:any = company.users || [];
    args.walletAddresses.forEach(async (walletAddr:string) => {
      const company:ICompany = await Company.findOne({walletAddr: args.companyWalletAddr});
      await User.findOneAndUpdate(
          {walletAddr: walletAddr, companyId: company._id},
          {status: CONS.TRANSACTION.STATUS.approve},
      );
      const user:IUser = await User.findOne({walletAddr: walletAddr});
      if (user && !users.includes(user._id.toString())) {
        users.push(user._id.toString());
        await Company.findOneAndUpdate({_id: company._id}, {users: users});
      }
    });
    return true;
  };
};
