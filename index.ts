import { Client, GatewayIntentBits, Options  } from 'discord.js';
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord"

import dotenv from 'dotenv';
dotenv.config();

import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import { BotClient } from './types';
import { loadLavalinkEvents } from './lavaklinkEvents';
import graphql from './events/graphql';

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://f0384b2662b76db0e37d346548a82e2e@o4506921730244608.ingest.us.sentry.io/4506921738240000",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

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
graphql(client, lavalink);

client.on("raw", d => lavalink.sendRawData(d));

client.login(process.env.DISCORD_TOKEN);