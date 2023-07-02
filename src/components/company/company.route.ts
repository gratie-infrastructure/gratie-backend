import {Router} from 'express';
import companyController from './company.controller';
const route:any = Router;
const companyRoute = route({mergeParams: true});

companyRoute
    .post('/create', companyController.createCompany)
    .put('/update', companyController.updateCompany)
    .post('/user', companyController.addUser)
    .get('/user/list', companyController.listUsers)
    .get('/', companyController.getCompany)
    .get('/list', companyController.getAllCompany)
    .get('/transaction', companyController.transaction)
    .post('/nft/purchase', companyController.nftPurchase)
    // .post('/user/approval', companyController.userApproval)
    .post('/transaction', companyController.mintToken);

export default companyRoute;
