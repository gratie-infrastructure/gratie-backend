import {ethers} from 'ethers';
import {CONS} from '../../../abstractions/constant';
import Company from '../../../components/company/company.schema';
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
    switch (eventName) {
      case 'BusinessNftTierAdded':
        eventData = {
          by: event.args.by,
          tierID: event.args.tierID.toString(),
          tier: event.args.tier.map((i:any) => i.toString()),
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'BusinessNftTiersActivated':
        eventData = {
          by: event.args.by,
          ids: event.args.ids.map((id:any) => id.toString()),
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'BusinessNftTiersDeactivated':
        eventData = {
          by: event.args.by,
          ids: event.args.ids.map((id:any) => id.toString()),
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'BusinessRegistered':
        eventData = {
          by: event.args.by,
          businessID: event.args.businessID.toString(),
          businessNftTier: event.args.businessNftTier.toString(),
          name: event.args.name,
          email: event.args.email,
          divisionsCreated: event.args.divisionsCreated.toString(),
          divisions: event.args.divisions.map((div:any) => div.toString()),
          paymentMethod: event.args.paymentMethod.toString(),
          paymentAmount: event.args.paymentAmount.toString(),
          timestamp: event.args.timestamp.toString(),
        };
        const dbData:any = {
          name: event.args.name,
          email: event.args.email,
          status: CONS.TRANSACTION.STATUS.pending,
          tier: event.args.businessNftTier.toString(),
          distribution: 0,
          walletAddr: event.args.by,
        };
        const company = await Company.findOne({email: eventData.email});
        if (!company) {
          await Company.create(dbData);
        }
        break;
      case 'BusinessRegisteredByOwner':
        eventData = {
          by: event.args.by,
          businessID: event.args.businessID.toString(),
          businessNftTier: event.args.businessNftTier.toString(),
          to: event.args.to,
          name: event.args.name,
          email: event.args.email,
          divisionsCreated: event.args.divisionsCreated.toString(),
          divisions: event.args.divisions.map((div: any) => div.toString()),
          timestamp: event.args.timestamp.toString(),
        };
        const dbDataOwner:any = {
          name: event.args.name,
          email: event.args.email,
          status: CONS.TRANSACTION.STATUS.pending,
          tier: event.args.businessNftTier.toString(),
          distribution: 0,
          walletAddr: event.args.by,
        };
        const companyOwner = await Company.findOne({email: eventData.email});
        if (!companyOwner) {
          await Company.create(dbDataOwner);
        }
        break;
      case 'ServiceProviderDivisionAdded':
        eventData = {
          by: event.args.by,
          businessID: event.args.businessID.toString(),
          serviceProviderNftID: event.args.serviceProviderNftID.toString(),
          divisionNumber: event.args.divisionNumber.toString(),
          name: event.args.name,
          ipfsMetadataLink: event.args.ipfsMetadataLink,
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'ServiceProvidersRegistered':
        eventData = {
          by: event.args.by,
          businessId: event.args.businessId.toString(),
          divisionId: event.args.divisionId.toString(),
          addresses: event.args.addresses,
          usdcPlatformFeePaid: event.args.usdcPlatformFeePaid.toString(),
          timestamp: event.args.timestamp.toString(),
        };
        const apiData:CompanyApproveParam = {
          walletAddresses: eventData.addresses,
          companyWalletAddr: eventData.by,
          status: CONS.TRANSACTION.STATUS.approve,
          transactionHash: event.transactionHash,
        };
        await companyService.approveUser(apiData);
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
          by: event.args.by,
          businessId: event.args.businessId.toString(),
          mintNonce: event.args.mintNonce.toString(),
          rewardToken: event.args.rewardToken,
          amount: event.args.amount.toString(),
          lockInPercentage: event.args.lockInPercentage.toString(),
          totalSupply: event.args.totalSupply.toString(),
          timestamp: event.args.timestamp.toString(),
        };
        break;
      case 'RewardDistributionCreated':
        eventData = {
          by: event.args.by,
          businessId: event.args.businessId.toString(),
          distributionNo: event.args.distributionNo.toString(),
          totalServiceProviders: event.args.totalServiceProviders.toString(),
          percentageToDistribute: event.args.percentageToDistribute.toString(),
          availableRewardTokens: event.args.availableRewardTokens.toString(),
          tokensPerProvider: event.args.tokensPerProvider.toString(),
          startTimestamp: event.args.startTimestamp.toString(),
        };
        break;
      case 'RewardTokensClaimed':
        eventData = {
          by: event.args.by,
          businessId: event.args.businessId.toString(),
          distributionNo: event.args.distributionNo.toString(),
          rewardToken: event.args.rewardToken,
          amount: event.args.amount.toString(),
          timestamp: event.args.timestamp.toString(),
        };
        break;
    };
    console.log(eventData);
  } catch (error) {
    console.log('addEvent: ', error);
    throw new Error(error);
  }
}

export default addEvent;

