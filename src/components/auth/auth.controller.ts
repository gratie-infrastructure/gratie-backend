import {Request, Response, NextFunction} from "express";
import Util from "../../lib/util";
// import AuthService from "./auth.service";
import logger from "../../lib/logger";

export default new class AuthController {

  async login(req: Request, res:Response) {
    try {
    //   const token = await AuthService.botLogin();
      res.status(Util.status.ok).json({accessToken: null});
    } catch (err) {
      logger.error(`Token validating getting error for user:${err.stack}`);
      res.status(Util.status.forbidden).send(Util.getErrorMsg(err));
    }
  }
};
