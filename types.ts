import type { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import type { LavalinkManager } from "lavalink-client";
import type { ReacordDiscordJs } from "reacord";
// import { RedisClientType } from "redis";

export interface Command extends ChatInputApplicationCommandData {
  adminOnly: boolean;
  ownerOnly: boolean;
  category: number;
  run: (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => void;
}

export interface CustomRequester {
  id: string,
  username: string,
  avatar?: string,
}

export interface Event {
  name: string,
  run: (client:BotClient, ...params:any) => any;
}

export interface BotClient extends Client {
  lavalink: LavalinkManager;
  commands: Command;
  // redis: RedisClientType;
  defaultVolume: number;
}