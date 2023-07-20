// /* eslint-disable new-cap */

import {CompanyApproveParam, ICompany} from './company.interface';
import User from './user.schema';
import {CONS} from '../../abstractions/constant';
import Company from './company.schema';
import TransactionService from './../transaction/transaction.service';


export default new class CompanyService {
  approveUser = async (companyId: Object, userId: Object) => {
    console.log('companyId', companyId);

    console.log('userId', userId);
    try {
      // Update the user's status under the company
      await Company.updateOne(
          {
            '_id': companyId,
            'users.user': userId,
          },
          {
            $set: {'users.$[elem].status': CONS.TRANSACTION.STATUS.notClaimed},
          },
          {
            arrayFilters: [{'elem.user': userId}],
          },
      );

      // Update the company's status for the user
      await User.updateOne(
          {
            '_id': userId,
            'companies.company': companyId,
          },
          {
            $set: {'companies.$[elem].status': CONS.TRANSACTION.STATUS.notClaimed},
          },
          {
            arrayFilters: [{'elem.company': companyId}],
          },
      );

      console.log('User approved successfully.');
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  approveBulkUsers = async (args: CompanyApproveParam) => {
    const company:ICompany = await Company.findOne({walletAddr: args.companyWalletAddr});
    args.walletAddresses.forEach(async (walletAddr:string) => {
      const user:any = await User.findOne({'walletAddr': walletAddr, 'companies.company': company._id});

      // const user:any = await User.findOne({walletAddr: walletAddr, companies: {$elemMatch: {id: Object(company._id)}}});
      if (user) {
        await this.approveUser(company._id, user._id);
      }
    });
    return true;
  };

  rewardTokenClaimed = async (walletAddr:string, companyId:String) => {
    const company:ICompany = await Company.findOne({tokenId: companyId});
    const user:any = await User.findOne({'walletAddr': walletAddr, 'companies.company': company._id});
    // const user:any = await User.findOne({walletAddr: walletAddr, companies: {$elemMatch: {id: Object(company._id)}}});
    if (user) {
      await this.updateClaim(company._id, user._id);
    }
    return true;
  };

  updateClaim = async (companyId: Object, userId: Object) => {
    console.log('companyId', companyId);

    console.log('userId', userId);
    try {
      // Update the user's status under the company
      await Company.updateOne(
          {
            '_id': companyId,
            'users.user': userId,
          },
          {
            $set: {'users.$[elem].status': CONS.TRANSACTION.STATUS.claimed},
          },
          {
            arrayFilters: [{'elem.user': userId}],
          },
      );

      // Update the company's status for the user
      await User.updateOne(
          {
            '_id': userId,
            'companies.company': companyId,
          },
          {
            $set: {'companies.$[elem].status': CONS.TRANSACTION.STATUS.claimed},
          },
          {
            arrayFilters: [{'elem.company': companyId}],
          },
      );

      console.log('User approved successfully.');
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  signAndApprove = async (args: any) => {
    const allowedAdmin = process.env.ADMIN_WALLET_ADDRESS.split(',');
    if (!allowedAdmin.includes(args.walletAddr)) {
      throw new Error('Admin only allowed for this action');
    }
    const company:ICompany = await Company.findOne({_id: args.companyId});
    if (!company) {
      throw new Error('Company not found');
    }
    await Company.findOneAndUpdate({_id: company._id}, {
      status: CONS.TRANSACTION.STATUS.adminApproved,
      rewardSignatureHash: args.rewardSignatureHash,
    });
    args.metaData = {
      rewardSignatureHash: args.rewardSignatureHash,
    },
    args.transactionType = CONS.TRANSACTION.TYPE.companyApprovalByAdmin;
    await TransactionService.createTransaction(args);
    return true;
  };
};
