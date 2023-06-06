import {Router} from 'express';
import companyController from './company.controller';
const route:any = Router;
const companyRoute = route({mergeParams: true});

companyRoute
    .post('/create', companyController.createCompanyUsers)
    .get('/list', companyController.listUsers)
    .get('/transaction', companyController.transaction);

export default companyRoute;