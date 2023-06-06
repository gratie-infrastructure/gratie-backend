import {Router} from 'express';
import authController from './auth.controller';
import userController from './user.controller';
const route:any = Router;
const authRouter = route({mergeParams: true});
const meRoute = route({mergeParams: true});

meRoute.get('/me', authController.me);

export {meRoute};

authRouter
    .post('/login', authController.login)
    .post('/signup', authController.signUp)
    .get('/list', userController.listUsers)
    .post('/create', userController.createUsers)
    .post('/updateToken', userController.saveToken);
export default authRouter;
