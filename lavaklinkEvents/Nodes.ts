import { LavalinkManager } from "lavalink-client/dist/types";
import { BotClient } from "../types";
import logger from '../logger';

export function NodesEvents(client:BotClient, lavalink: LavalinkManager) {
  lavalink.nodeManager.on("error", (node, error, payload) => {
    logger.error(node.id, error, payload);
  });
}