import {ethers} from 'ethers';
import contractABI from '../abi/gratie.abi.json';
import 'dotenv/config';

const gratieContractAddress = process.env.GRATIE_CONTRACT_ADDRESS;
const contractIface = new ethers.utils.Interface(contractABI);

const eventFilters = {
  'BusinessNftTierAdded': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('BusinessNftTierAdded')],
  },
  'BusinessNftTiersActivated': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('BusinessNftTiersActivated')],
  },
  'BusinessNftTiersDeactivated': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('BusinessNftTiersDeactivated')],
  },
  'BusinessRegistered': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('BusinessRegistered')],
  },
  'BusinessRegisteredByOwner': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('BusinessRegisteredByOwner')],
  },
  'ServiceProviderDivisionAdded': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('ServiceProviderDivisionAdded')],
  },
  'ServiceProvidersRegistered': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('ServiceProvidersRegistered')],
  },
  'ServiceProvidersRemoved': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('ServiceProvidersRemoved')],
  },
  'RewardTokensGenerated': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('RewardTokensGenerated')],
  },
  'RewardDistributionCreated': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('RewardDistributionCreated')],
  },
  'RewardTokensClaimed': {
    address: gratieContractAddress,
    topics: [contractIface.getEventTopic('RewardTokensClaimed')],
  },
};

export default eventFilters;
