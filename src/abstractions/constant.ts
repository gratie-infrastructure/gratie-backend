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
      minted: 1,
      pending: 2,
      approved: 3,
      rejected: 4,
    },
    USERS: {
      company: 'COMPANY',
      companyUser: 'COMPANYUSER',
    },
    TYPE: {
      companyApprovalByAdmin: 1,
      userApproval: 2,
      nftMintCompany: 3, // company mint the NFT
      tokenMintCompany: 4, // WHile generating the NFT Token
      rewardTokenClaimByUser: 5,
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
