import express, {Application, Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import Route from './route';
import {dbInit} from '../lib/db';
import logger, {morganMiddleware} from '../lib/logger';
import game, {init} from '../abstractions/auth';

const cors = require('cors');


export default class MiddleWare {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
    this.initMiddleware();
    this.initRoutes();
    dbInit();
    init();
  }

  initMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(bodyParser.json());
    this.app.use(morganMiddleware);
    this.app.use(express.static('public'));
  }

  initRoutes() {
    Route.init(this.app, this.getToken);
    this.app.use(this.errorHandler);
  }

  async getToken(req:Request, res:Response, next:NextFunction) {
    const token:string = req.headers.authorization;
    if (token) {
      try {
        req.app.locals.user = await game.getUserByToken(token);
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next(Error('Auth Token Needed!!'));
    }
  }

  errorHandler(err:Error, req:Request, res:Response, next:NextFunction) {
    logger.debug(typeof next);
    return res.status(401).json({error: err.message});
  }
}
