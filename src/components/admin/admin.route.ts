import {Router} from 'express';
import adminController from './admin.controller';
const route:any = Router;
const adminRoute = route({mergeParams: true});

adminRoute
    .post('/approve', adminController.approve);

export default adminRoute;
