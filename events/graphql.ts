import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Client } from 'discord.js';
import { LavalinkManager } from 'lavalink-client/dist/types';
import logger from '../logger';

function sleep(ms: number | undefined) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async (client: Client, lavalink: LavalinkManager): Promise<void> => {
  await sleep(3000);
  const typeDefs = `#graphql
    type BotStats {
      id: String
      serverCount: String
      channelCount: String
      userCount: String
    }

    type Query {
      botstats: [BotStats]
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

  const resolvers = {
    Query: {
      botstats: () => botStats,
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  logger.info(`GraphQL Server ready at: ${url}`);
};
