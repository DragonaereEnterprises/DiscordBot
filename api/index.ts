import { Client } from "discord.js";

import path from 'path';
import express from 'express';

export default (client: Client): void => {
  const server = express()

  server.set('trust proxy', '127.0.0.1');

  server.use('*', express.static(path.join(__dirname, 'static')))

  server.listen(3001, () => {
    console.log("Dashboard running on port 3001!")
  })
};