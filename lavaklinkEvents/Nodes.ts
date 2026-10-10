import type { LavalinkManager } from "lavalink-client";
import type { BotClient } from "../types.ts";
import logger from '../logger.ts';

export function NodesEvents(_client:BotClient, lavalink: LavalinkManager) {
  lavalink.nodeManager.on("error", (node, error, payload) => {
    logger.error(`Lavalink Node ${node.id} encountered an error: ${error.message}, ${JSON.stringify(payload)}`);
  });
}