import {Router} from 'express';
import companyController from './company.controller';
const route:any = Router;
const companyRoute = route({mergeParams: true});

companyRoute
    .post('/create', companyController.createCompanyUsers)
    .post('/user', companyController.addUser)
    .get('/list', companyController.listUsers)
    .get('/transaction', companyController.transaction)
    .post('/transaction', companyController.mintToken);

export default companyRoute;