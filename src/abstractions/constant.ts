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
      pending: 'PENDING',
      approve: 'APPROVE',
      reject: 'REJECT',
    },
    USERS: {
      company: 'COMPANY',
      companyUser: 'COMPANYUSER',
    },
    TYPE: {
      companyApproval: 'COMPANYAPPROVAL',
      userApproval: 'USERAPPROVAL',
      nftMint: 'NFTMINT',
      tokenMint: 'TOKENMINT',
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
