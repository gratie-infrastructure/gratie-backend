import {Router} from 'express';
import authController from './auth.controller';
const route:any = Router;
const authRoute = route({mergeParams: true});

authRoute
    .post('/login', authController.login);

export default authRoute;
