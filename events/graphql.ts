import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { Client } from 'discord.js';
import { LavalinkManager } from 'lavalink-client/dist/types';
import logger from '../logger';
import cors from 'cors';

function sleep(ms: number | undefined) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async (client: Client, lavalink: LavalinkManager): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app);
  
  await sleep(3000);
  const typeDefs = `#graphql
    type BotStats {
      id: String
      serverCount: String
      channelCount: String
      userCount: String
    }

    type BotGuilds {
      id: [String]
    }

    type Query {
      botstats: [BotStats]
      botguilds: [BotGuilds]
    }
  `;

  const botStats = [
    {
      serverCount: Number.parseFloat(String(client.guilds.cache.size)).toLocaleString("en-US"),
      channelCount: Number.parseFloat(String(client.channels.cache.size)).toLocaleString("en-US"),
      userCount: Number.parseFloat(String(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))).toLocaleString("en-US"),
      id: Number.parseFloat(String(client.guilds.cache.size)).toLocaleString("en-US")+Number.parseFloat(String(client.channels.cache.size)).toLocaleString("en-US")+Number.parseFloat(String(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))).toLocaleString("en-US")
    }
  ];

  const botGuilds = [
    {
      id: client.guilds.cache.map((guild) => guild.id),
    }
  ];

  const resolvers = {
    Query: {
      botstats: () => botStats,
      botguilds: () => botGuilds,
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageDisabled(),ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  app.use(
    '/',
    cors<cors.CorsRequest>({ origin: ['https://discordbotapi.dragonaere.com','https://bot.dragonaere.com/', 'https://studio.apollographql.com'] }),
    express.json(),
    expressMiddleware(server),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

  logger.info(`GraphQL Server Ready`);
};
