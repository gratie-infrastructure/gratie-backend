import {Request, Response} from 'express';
import Util from '../../lib/util';
import CompanyService from "./../company/company.service";
import logger from '../../lib/logger';

export default new class AdminController {
  async approve(req: Request, res:Response) {
    try {
      CompanyService.signAndApprove(req.body);
      res.status(Util.status.ok).json({accessToken: null});
    } catch (err) {
      logger.error(`Token validating getting error for user:${err.stack}`);
      res.status(Util.status.forbidden).send(Util.getErrorMsg(err));
    }
  }
};
