import dotenv from 'dotenv';
import express, { Express } from "express";
import cors from 'cors';

import routes from "./routes";
import allowsOrigin from './app/config/allowsOrigin';

class App {
  server: Express;

  constructor() {
    this.server = express();
    dotenv.config();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.server.use(cors({
      origin: (origin, callback) => {
        if (allowsOrigin.indexOf(origin as string) !== -1 || !origin) {
          return callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: 'GET, HEAD, PUT, POST, DELETE',
      allowedHeaders:  'Content-Type, Authorization',
    }));
    
    this.server.use(express.json());
  }

  private  routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;