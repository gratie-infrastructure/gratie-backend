import AWS from 'aws-sdk';
import 'dotenv/config';
import {ethers} from 'ethers';
import contractABI from './../blockchain/events/abi/gratie.abi.json';


const domainName = process.env.CONTRACT_DOMAIN_NAME;
const domainVersion = process.env.CONTRACT_DOMAIN_VERSION;
const chainId = process.env.CHAIN_ID;
const contractAddress = process.env.GRATIE_CONTRACT_ADDRESS;
const lambdaFunctionName = process.env.LAMBDA_FUNCTION_NAME;
const rpcUrl = process.env.RPC_URL;


async function generateSignature(sigType:string, params:any) {
  const args = params;
  try {
    const domain = {
      name: domainName,
      version: domainVersion,
      chainId: chainId,
      verifyingContract: contractAddress,
    };
    let types; let data;

    if (sigType === 'NFT_BUY') {
      types = {
        Payment: [
          {name: 'method', type: 'address'},
          {name: 'amount', type: 'uint256'},
          {name: 'tierID', type: 'uint256'},
          {name: 'buyer', type: 'address'},
        ],
      };
      data = {
        method: args.paymentMethod,
        amount: args.paymentAmount,
        tierID: args.tierID,
        buyer: args.buyer,
      };
    } else if (sigType === 'TOKEN_MINT') {
      types = {
        RewardTokenMint: [
          {name: 'businessId', type: 'uint256'},
          {name: 'amount', type: 'uint256'},
          {name: 'lockInPercentage', type: 'uint256'},
          {name: 'mintNonce', type: 'uint256'},
        ],
      };
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      let mintNonce = await contract.rewardTokenMints(args.businessId);
      data = {
        businessId: args.businessId,
        amount: args.amount,
        lockInPercentage: args.lockInPercentage,
        mintNonce: ++mintNonce,
      };
    } else {
      throw new Error(`Invalid Sig Type: ${sigType}`);
    }

    const params = {
      FunctionName: lambdaFunctionName,
      Payload: JSON.stringify({
        domain: domain,
        types: types,
        data: data,
      }),
    };
    console.log('params', params);
    const lambdaResponse:any = await (new AWS.Lambda().invoke(params).promise());
    const payload:any = JSON.parse(lambdaResponse.Payload);
    console.log('payload----', payload);
    if (!payload.body) {
      return {
        error: true,
        data: null,
        message: 'failure',
      };
    }
    return {
      error: false,
      data: {
        signature: payload.body,
      },
      message: 'success',
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      data: null,
      message: 'failure',
    };
  }
}

export default generateSignature;
