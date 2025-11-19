import { Client, GatewayIntentBits, Options  } from 'discord.js';
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord"

import { loadEnvFile } from 'node:process';
loadEnvFile('.env');

import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import { BotClient } from './types';
import { loadLavalinkEvents } from './lavaklinkEvents';
import graphql from './events/graphql';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  sweepers: {
		...Options.DefaultSweeperSettings,
		users: {
			interval: 3_600,
			filter: () => user => user.bot && user.id !== user.client.user.id,
		},
	},
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
	}),
}) as BotClient;

const lavalink = new LavalinkManager({
  nodes: [
    {
      host: process.env.LAVALINK_HOST as string || "localhost",
      port: process.env.LAVALINK_PORT ? parseInt(process.env.LAVALINK_PORT) : 2333,
      authorization: process.env.LAVALINK_PASSWORD as string,
    }
  ],
  sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
      id: process.env.DISCORD_CLIENT_ID as string
  },
  playerOptions: {
    onEmptyQueue: {
      destroyAfterMs: 30_000, 
    },
    volumeDecrementer: 0.75,
    defaultSearchPlatform: "ytmsearch",
    useUnresolvedData: true,
  },
  queueOptions: {
      maxPreviousTracks: 10
  },
}) as LavalinkManager;

const reacord = new ReacordDiscordJs(client)

ready(client, lavalink);
interactionCreate(client, reacord, lavalink);
loadLavalinkEvents(client, reacord, lavalink);
graphql(client, lavalink);

client.on("raw", d => lavalink.sendRawData(d));

client.login(process.env.DISCORD_TOKEN);