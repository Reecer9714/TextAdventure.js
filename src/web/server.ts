import env from "../env";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConsoleHttpServer } from '../core/server/http-server';

import necroCartridgeFactory from '../cartridges/necro';
import { CartridgeBuilder } from '../builders/cartridge.builder';

const port = env.WEB_SERVER_PORT;
const ipAddress = env.WEB_SERVER_IP;

const cartridgeBuilder = new CartridgeBuilder();
const necroCartridge = necroCartridgeFactory(cartridgeBuilder);

const server = new ConsoleHttpServer(necroCartridge, {
  ipAddress: ipAddress,
  port: port,
});

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)
server.use(express.static(path.join(__dirname, 'static'))).listen();
