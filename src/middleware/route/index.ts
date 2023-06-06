import {Application} from 'express';
import {CONS} from '../../abstractions/constent';
import authRouter,{meRoute} from '../../components/auth/auth.route';
import userRoute from '../../components/auth/user.route';
import companyRoute from '../../components/company/company.route';
export default class Route {
  static init(app: Application, authMiddleware:any) {
    app.use(`${CONS.API.VERSION.V1}/`, authRouter);
    app.use(`${CONS.API.VERSION.V1}/`, authMiddleware, meRoute);
    app.use(`${CONS.API.VERSION.V1}/user`, authMiddleware, userRoute);
    app.use(`${CONS.API.VERSION.V1}/user`, authMiddleware, companyRoute);
  }
}
