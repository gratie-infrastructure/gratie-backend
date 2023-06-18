import {Application} from 'express';
import {CONS} from '../../abstractions/constant';
import companyRoute from '../../components/company/company.route';
export default class Route {
  static init(app: Application) {
    app.use(`${CONS.API.VERSION.V1}/org`, companyRoute);
  }
}
