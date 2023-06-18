import AWS from 'aws-sdk';
import 'dotenv/config';

const domainName = process.env.CONTRACT_DOMAIN_NAME;
const domainVersion = process.env.CONTRACT_DOMAIN_VERSION;
const chainId = process.env.CHAIN_ID;
const contractAddress = process.env.GRATIE_CONTRACT_ADDRESS;
const lambdaFunctionName = process.env.LAMBDA_FUNCTION_NAME;


async function generateSignature(
    _paymentMethod: string,
    _paymentAmount: bigint,
    _tierID: string,
    _buyer: string,
) {
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
      method: _paymentMethod,
      amount: _paymentAmount,
      tierID: _tierID,
      buyer: _buyer,
    };

    const params = {
      FunctionName: lambdaFunctionName,
      Payload: JSON.stringify({
        data: [domain, types, data],
      }),
    };
    const lambdaResponse = await (new AWS.Lambda().invoke(params).promise());
    const payload:any = JSON.parse(lambdaResponse.Payload);
    if (!payload.body) {
      return {
        flag: true,
        data: null,
        message: 'failure',
      };
    }
    return {
      flag: false,
      data: {
        signature: payload.body,
      },
      message: 'success',
    };
  } catch (error) {
    console.log(error);
    return {
      flag: true,
      data: null,
      message: 'failure',
    };
  }
}

export default generateSignature;
