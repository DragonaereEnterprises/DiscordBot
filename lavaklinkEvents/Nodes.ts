import { LavalinkManager } from "lavalink-client/dist/index";
import { BotClient } from "../types";
import logger from '../logger';

export function NodesEvents(client:BotClient, lavalink: LavalinkManager) {
  lavalink.nodeManager.on("error", (node, error, payload) => {
    logger.error(`Lavalink Node ${node.id} encountered an error: ${error.message}, ${JSON.stringify(payload)}`);
  });
}