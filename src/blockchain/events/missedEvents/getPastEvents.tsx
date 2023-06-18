import ethers from 'ethers';
import contractABI from '../abi/gratie.abi.json';
import 'dotenv/config';

const contractAddress: any = process.env.GRATIE_CONTRACT_ADDRESS;
const rpcUrl = process.env.RPC_URL;
const eventQueryBlockRange: any = process.env.EVENT_QUERY_BLOCK_RANGE;


async function getPastEvents(eventName, startBlockNumber = 0) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    let blockNo;
    if (startBlockNumber) {
      blockNo = startBlockNumber;
    } else {
      blockNo = process.env.CONTRACT_DEPLOYMENT_BLOCK_NUMBER;
      // Get latest block number from database.
      // blockNo = from db;
    }

    // Get latest block number from network.
    const currentBlock = await provider.getBlockNumber();
    const queriedEvents = [];

    let lowerBlockNo = parseInt(blockNo);
    let upperBlockNo = (lowerBlockNo + parseInt(eventQueryBlockRange)) > currentBlock ?
        currentBlock :
        lowerBlockNo + parseInt(eventQueryBlockRange);

    while (upperBlockNo <= currentBlock) {
      const events: any = await contract.queryFilter(eventName, lowerBlockNo, upperBlockNo);
      queriedEvents.push(...events);

      if (upperBlockNo === currentBlock) {
        break;
      }
      lowerBlockNo = upperBlockNo;
      upperBlockNo = (upperBlockNo + parseInt(eventQueryBlockRange)) >= currentBlock ?
          currentBlock :
          lowerBlockNo + parseInt(eventQueryBlockRange);
    }

    return {
      events: queriedEvents,
      startBlockNumber: blockNo,
      endBlockNumber: currentBlock,
    };
  } catch (error) {
    console.log('getPastEvents: ', error);
    throw new Error(error);
  }
}

export default getPastEvents;
