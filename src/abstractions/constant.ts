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
    },
  },
};
