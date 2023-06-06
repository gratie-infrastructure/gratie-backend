import {Router} from 'express';
import userController from './user.controller';
const route:any = Router;
const userRoute = route({mergeParams: true});

userRoute
    .get('/listUsers', userController.listUsers)
    .get('/listUser', userController.listUser)
    .post('/create', userController.createUsers)
    .post('/updateToken', userController.saveToken);

export default userRoute;