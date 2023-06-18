import dotenv from 'dotenv';
import {join} from 'path';
dotenv.config({path: join(process.cwd(), '.env')});
import express, {Application} from 'express';
import logger from './lib/logger';
// import redis from './lib/redis';
import Middleware from './middleware';
import {createServer} from 'http';
import contractEventListener from './blockchain/events/eventListeners';

console.log("test", contractEventListener());

// redis.init();
const port: string = process.env.PORT;
const app: Application = express();
const httpServer = createServer(app);
new Middleware(app);

httpServer.listen( port, () => {
  logger.info( `server started at http://localhost:${ port }` );
} );

process.on('uncaughtException', function(err) {
  logger.error(err.stack)
});

process.on('unhandledRejection', (err:Error) => {
  logger.error(err.stack)
})


module.exports = app;
