export const CONS = {
  API: {
    VERSION: {V1: '/api/v1'},
  },
  REDIS: {
    KEY: {
      SURVEY: (id:string) => `survey:${id}`,
      LB: (id:string) => `lb:survey:${id}`,
    },
  },
  TRANSACTION: {
    STATUS: {
      minted: 'MINTED',
      pending: 'PENDING',
      adminApproved: 'ADMIN_APPROVED',
      approved: 'APPROVED',
      rejected: 'REJECTED',
    },
    USERS: {
      company: 'COMPANY',
      companyUser: 'COMPANYUSER',
    },
    TYPE: {
      companyApprovalByAdmin: 'COMPANY_APPROVAL_BY_ADMIN',
      userApproval: 'USER_APPROVAL',
      nftMintCompany: 'NFT_MINT_COMPANY', // company mint the NFT
      tokenMintCompany: 'TOKEN_MINT_COMPANY', // WHile generating the NFT Token
      rewardTokenClaimByUser: 'REWARD_TOKEN_CLAIM_BY_USER',
    },
    TIER: {
      '1': 'Mini',
      '2': 'Bantom',
      '3': 'Fractal',
      '4': 'Optical',
      '5': 'Paradise',
      '6': 'Cosmos',
    },
  },
};
