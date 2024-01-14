import { LavalinkManager } from "lavalink-client/dist/types";
import { BotClient } from "../types";

export function NodesEvents(client:BotClient, lavalink: LavalinkManager) {
  lavalink.nodeManager.on("error", (node, error, payload) => {
    console.log(node.id, " :: ERRORED :: ", error, " :: PAYLOAD :: ", payload);
  });
}