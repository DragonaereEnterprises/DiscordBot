import { BotClient } from "../types";
import { NodesEvents } from "./Nodes";
import { PlayerEvents } from "./Player";
import { ReacordDiscordJs } from "reacord";
import { LavalinkManager } from "lavalink-client/dist/types";

export function loadLavalinkEvents(client:BotClient, reacord: ReacordDiscordJs, lavalink: LavalinkManager) {
    NodesEvents(client, lavalink);
    PlayerEvents(client, reacord, lavalink);
}