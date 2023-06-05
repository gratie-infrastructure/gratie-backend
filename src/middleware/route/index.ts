import {Application} from 'express';
import {CONS} from '../../abstractions/constent';
import authRouter,{meRoute} from '../../components/auth/auth.route';
export default class Route {
  static init(app: Application, authMiddleware:any) {
    app.use(`${CONS.API.VERSION.V1}/`, authRouter);
    app.use(`${CONS.API.VERSION.V1}/`, authMiddleware, meRoute);
  }
}
