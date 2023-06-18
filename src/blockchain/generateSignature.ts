import AWS from 'aws-sdk';
import 'dotenv/config';
import {signParam} from './../components/company/company.interface';


const domainName = process.env.CONTRACT_DOMAIN_NAME;
const domainVersion = process.env.CONTRACT_DOMAIN_VERSION;
const chainId = process.env.CHAIN_ID;
const contractAddress = process.env.GRATIE_CONTRACT_ADDRESS;
const lambdaFunctionName = process.env.LAMBDA_FUNCTION_NAME;


async function generateSignature(params:signParam) {
  const paymentMethod = params.paymentMethod;
  const paymentAmount = params.paymentAmount;
  const tierID = params.tierID;
  const buyer = params.buyer;
  try {
    const domain = {
      name: domainName,
      version: domainVersion,
      chainId: chainId,
      verifyingContract: contractAddress,
    };

    const types = {
      Payment: [
        {name: 'method', type: 'address'},
        {name: 'amount', type: 'uint256'},
        {name: 'tierID', type: 'uint256'},
        {name: 'buyer', type: 'address'},
      ],
    };

    const data = {
      method: paymentMethod,
      amount: paymentAmount,
      tierID: tierID,
      buyer: buyer,
    };

    const params = {
      FunctionName: lambdaFunctionName,
      Payload: JSON.stringify({
        data: [domain, types, data],
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
