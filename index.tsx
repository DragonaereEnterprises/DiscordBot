import { Client, GatewayIntentBits } from 'discord.js';
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord"

import dotenv from 'dotenv';
dotenv.config();

import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import { BotClient } from './types';
import { loadLavalinkEvents } from './lavaklinkEvents';
import api from './api';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
] }) as BotClient;

const lavalink = new LavalinkManager({
  nodes: [
    {
      host: "localhost",
      port: 2333,
      authorization: "youshallnotpass"
    }
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
      id: process.env.DISCORD_CLIENT_ID as string,
      username: "Dragonaere"
  },
  playerOptions: {
    onEmptyQueue: {
      destroyAfterMs: 30_000, 
    }
  },
  queueOptions: {
      maxPreviousTracks: 10
  },
});

const reacord = new ReacordDiscordJs(client)

ready(client, lavalink);
interactionCreate(client, reacord, lavalink);
loadLavalinkEvents(client, reacord, lavalink);
api(client);

client.on("raw", d => lavalink.sendRawData(d));

client.login(process.env.DISCORD_TOKEN);