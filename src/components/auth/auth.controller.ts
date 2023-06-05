import {Request, Response} from 'express';
import Util from '../../lib/util';
import gameAuth from '../../abstractions/auth';

export default new class AuthController {

  async login(req: Request, res:Response) {
    try {
      const {email, otp} = req.body;
      const mail = await gameAuth.loginWithOTP({email, otp});
      return res.json({ message: mail });
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async signUp(req: Request, res:Response) {
    try {
      const {email, otp, userName} = req.body;
      const token = await gameAuth.signUpWithOTP({email, otp, userName});
      return res.json({ message: token });
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }

  async me(req: Request, res:Response) {
    try {
      const {_id, userName, email, profile} = req.app.locals.user;
      const userDetail = {_id, userName, email, ...profile};
      res.status(Util.status.ok).json({userDetail});
    } catch (err) {
      res.status(Util.status.internalError).json(Util.getErrorMsg(err));
    }
  }
};
