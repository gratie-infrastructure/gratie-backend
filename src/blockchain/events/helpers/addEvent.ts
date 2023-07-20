import {ethers} from 'ethers';
import {CONS} from '../../../abstractions/constant';
import Company from '../../../components/company/company.schema';
import ITransaction from '../../../components/transaction/transaction.interface';
import TransactionService from '../../../components/transaction/transaction.service';
import companyService from '../../../components/company/company.service';
import {CompanyApproveParam} from '../../../components/company/company.interface';
import contractABI from '../abi/gratie.abi.json';
const contractIface = new ethers.utils.Interface(contractABI);


async function addEvent(event:any, eventName:string, wasMissed = false) {
  try {
    if (!wasMissed) {
      const decodedEventData = contractIface.decodeEventLog(
          eventName,
          event.data,
          event.topics,
      );
      event['event'] = eventName;
      event['args'] = decodedEventData;
    }

    let eventData;
    console.log("Event: ", event);
    switch (eventName) {
      // case 'BusinessNftTierAdded':
      //   eventData = {
      //     by: event.args.by,
      //     tierID: event.args.tierID.toString(),
      //     tier: event.args.tier.map((i:any) => i.toString()),
      //     timestamp: event.args.timestamp.toString(),
      //   };
      //   break;
      // case 'BusinessNftTiersActivated':
      //   eventData = {
      //     by: event.args.by,
      //     ids: event.args.ids.map((id:any) => id.toString()),
      //     timestamp: event.args.timestamp.toString(),
      //   };
      //   break;
      // case 'BusinessNftTiersDeactivated':
      //   eventData = {
      //     by: event.args.by,
      //     ids: event.args.ids.map((id:any) => id.toString()),
      //     timestamp: event.args.timestamp.toString(),
      //   };
      //   break;
      case 'BusinessRegistered':
        // eventData = {
        //   by: event.args.by,
        //   businessID: event.args.businessID.toString(),
        //   businessNftTier: event.args.businessNftTier.toString(),
        //   name: event.args.name,
        //   email: event.args.email,
        //   divisionsCreated: event.args.divisionsCreated.toString(),
        //   divisions: event.args.divisions.map((div:any) => div.toString()),
        //   paymentMethod: event.args.paymentMethod.toString(),
        //   paymentAmount: event.args.paymentAmount.toString(),
        //   timestamp: event.args.timestamp.toString(),
        // };
        const dbData:any = {
          name: event.args.name,
          tokenId: parseInt(event.args.businessID),
          email: event.args.email,
          status: CONS.TRANSACTION.STATUS.minted,
          tier: event.args.businessNftTier.toString(),
          distribution: 0,
          walletAddr: event.args.by,
        };
        const company = await Company.findOne({email: event.args.email});
        if (!company) {
          await Company.create(dbData);
        }
        break;
      case 'BusinessRegisteredByOwner':
        // eventData = {
        //   by: event.args.by,
        //   businessID: event.args.businessID.toString(),
        //   businessNftTier: event.args.businessNftTier.toString(),
        //   to: event.args.to,
        //   name: event.args.name,
        //   email: event.args.email,
        //   divisionsCreated: event.args.divisionsCreated.toString(),
        //   divisions: event.args.divisions.map((div: any) => div.toString()),
        //   timestamp: event.args.timestamp.toString(),
        // };
        const dbDataOwner:any = {
          name: event.args.name,
          tokenId: parseInt(event.args.businessID),
          email: event.args.email,
          status: CONS.TRANSACTION.STATUS.minted,
          tier: event.args.businessNftTier.toString(),
          distribution: 0,
          walletAddr: event.args.to,
        };
        const companyOwner = await Company.findOne({email: event.args.email});
        if (!companyOwner) {
          await Company.create(dbDataOwner);
        }
        break;
      // case 'ServiceProviderDivisionAdded':
      //   eventData = {
      //     by: event.args.by,
      //     businessID: event.args.businessID.toString(),
      //     serviceProviderNftID: event.args.serviceProviderNftID.toString(),
      //     divisionNumber: event.args.divisionNumber.toString(),
      //     name: event.args.name,
      //     ipfsMetadataLink: event.args.ipfsMetadataLink,
      //     timestamp: event.args.timestamp.toString(),
      //   };
      //   break;
      case 'ServiceProvidersRegistered':
        // eventData = {
        //   by: event.args.by,
        //   businessId: event.args.businessId.toString(),
        //   divisionId: event.args.divisionId.toString(),
        //   addresses: event.args.addresses,
        //   usdcPlatformFeePaid: event.args.usdcPlatformFeePaid.toString(),
        //   timestamp: event.args.timestamp.toString(),
        // };
        const apiData:CompanyApproveParam = {
          walletAddresses: event.args.addresses,
          companyWalletAddr: event.args.by,
          status: CONS.TRANSACTION.STATUS.approved,
          transactionHash: event.transactionHash,
        };
        await companyService.approveBulkUsers(apiData);
        break;
      case 'ServiceProvidersRemoved':
        eventData = {
          by: event.args.by,
          businessId: event.args.businessId.toString(),
          divisionId: event.args.divisionId.toString(),
          addresses: event.args.addresses,
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'RewardTokensGenerated':
        eventData = {
          tokenAddr: event.args.rewardToken,
          tokenName: event.args.tokenName.toString(),
          tokenSymbol: event.args.tokenSymbol.toString(),
          tokenIconUrl: event.args.tokenIconURL.toString(),
          amount: event.args.amount.toString(),
          status: CONS.TRANSACTION.STATUS.approved,
        };
        await Company.findOneAndUpdate({tokenId: parseInt(event.args.businessId)}, eventData);
        break;
      // case 'RewardDistributionCreated':
      //   eventData = {
      //     by: event.args.by,
      //     businessId: event.args.businessId.toString(),
      //     distributionNo: event.args.distributionNo.toString(),
      //     totalServiceProviders: event.args.totalServiceProviders.toString(),
      //     percentageToDistribute: event.args.percentageToDistribute.toString(),
      //     availableRewardTokens: event.args.availableRewardTokens.toString(),
      //     tokensPerProvider: event.args.tokensPerProvider.toString(),
      //     startTimestamp: event.args.startTimestamp.toString(),
      //   };
      //   break;
      case 'RewardTokensClaimed':
        const args: ITransaction = {
          walletAddr: event.args.by,
          companyId: event.args.businessId.toString(),
          metaData: {
            distributionNo: event.args.distributionNo.toString(),
            rewardToken: event.args.rewardToken,
            amount: event.args.amount.toString(),
          },
          transactionType: CONS.TRANSACTION.TYPE.rewardTokenClaimByUser,
        };
        await TransactionService.createTransaction(args);
        await companyService.rewardTokenClaimed(args.walletAddr, event.args.businessId.toString());
        break;
    };
    console.log(eventData);
  } catch (error) {
    console.log('addEvent: ', error);
    throw new Error(error);
  }
}

export default addEvent;

