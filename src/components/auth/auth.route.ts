import {Router} from 'express';
import authController from './auth.controller';
const route:any = Router;
const authRouter = route({mergeParams: true});
const meRoute = route({mergeParams: true});

meRoute.get('/me', authController.me);

export {meRoute};

authRouter
    .post('/login', authController.login)
    .post('/signup', authController.signUp)
export default authRouter;
