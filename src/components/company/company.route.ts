import {Router} from 'express';
import companyController from './company.controller';
const route:any = Router;
const companyRoute = route({mergeParams: true});

companyRoute
    .post('/create', companyController.createCompanyUsers)
    .put('/update', companyController.updateCompanyUser)
    .post('/user', companyController.addUser)
    .get('/list', companyController.listUsers)
    .get('/transaction', companyController.transaction)
    .post('/nft/purchase', companyController.nftPurchase)
    .post('/user/approval', companyController.userApproval)
    .post('/transaction', companyController.mintToken);

export default companyRoute;