import type { BotClient } from "../types.ts";
import { NodesEvents } from "./Nodes.ts";
import { PlayerEvents } from "./Player.tsx";
import type { ReacordDiscordJs } from "reacord";
import type { LavalinkManager } from "lavalink-client";

export function loadLavalinkEvents(client:BotClient, reacord: ReacordDiscordJs, lavalink: LavalinkManager) {
    NodesEvents(client, lavalink);
    PlayerEvents(client, reacord, lavalink);
}