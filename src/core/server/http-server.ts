import express, { Handler } from 'express';
import { Express } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import createConsole from '../console/console';

import { ICartridge } from '../types/textadventurejs.shim.js';

export interface IServerOptions {
  ipAddress?: string;
  port?: number;
  consoleApiPath?: string;
}

export class ConsoleHttpServer {
  private _options: IServerOptions = {};
  private _middleware: Handler[];
  private _app: Express;
  private _cartridge: ICartridge;

  constructor(cartridge: ICartridge, options: IServerOptions) {
    this._middleware = [];
    this._cartridge = cartridge;
    this._options = options;
  }

  private configure(): void {
    const consoleApiPath = this._options.consoleApiPath || '/console';

    this._app = express();

    // Security middleware
    this._app.use(helmet());
    this._app.use(cors());

    // Rate limiting
    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
      })
    );

    // Body parsing
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: true }));

    if (this._middleware) {
      this._middleware.forEach(toUse => {
        this._app.use(toUse);
      });
    }

    const con = createConsole(this._cartridge, {
      onDebugLog: (message: string) => {
        console.log(`    [DEBUG] ${message}`);
      },
    });

    this._app.post(consoleApiPath, function (req, res) {
      res.json({ response: con.input(req.body.input) });
    });
  }

  public use(middleware: Handler): ConsoleHttpServer {
    this._middleware.push(middleware);

    return this;
  }

  public listen(): void {
    this.configure();

    const port = this._options.port;
    const ipAddress = this._options.ipAddress;

    this._app.listen(port, ipAddress, function () {
      console.log('Listening on ' + ipAddress + ', server_port ' + port);
    });
  }
}
