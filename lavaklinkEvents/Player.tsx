import { TextChannel } from "discord.js";
import { BotClient, CustomRequester } from "../types";
import { formatMS_HHMMSS } from "../utils/Time";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../components/Embed";
import React from "react";
import { LavalinkManager } from "lavalink-client/dist/index";
import logger from '../logger';
import { log } from "console";

export function PlayerEvents(client:BotClient, reacord: ReacordDiscordJs, lavalink: LavalinkManager) {
    /**
     * PLAYER EVENTS
     */
  lavalink.on("playerCreate", (player) => {
    logger.info(`Guild ${player.guildId} -- Player Created`);
  }).on("playerDestroy", (player, reason) => {
    logger.info(`Guild ${player.guildId} -- Player Destroyed - Reason: ${reason}`);
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return logger.warn(`No Channel - ${player}`);
  }).on("playerDisconnect", (player, voiceChannelId) => {
    logger.info(`Guild ${player.guildId} -- Player Disconnected from Voice Channel ${voiceChannelId}`);
  }).on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
    logger.info(`Guild ${player.guildId} -- Player moved from Voice Channel ${oldVoiceChannelId} to ${newVoiceChannelId}`);
  }).on("playerSocketClosed", (player, payload) => {
    logger.info(`Guild ${player.guildId} -- Player Socket Closed - ${payload}`);
  })

  /**
   * Queue/Track Events
   */
  lavalink.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if (!track) return;
    const url = track.info.artworkUrl || track.pluginInfo?.artworkUrl as string;
    if(!channel) return;
    reacord.createChannelMessage(channel.id).render(<EmbedMessage 
      title={`${track.info.title}`.substring(0, 256)} 
      url={track.info.uri}
      thumbnail={{ url }}
      description={[
        `> - **Author:** ${track.info.author}`,
        `> - **Duration:** ${formatMS_HHMMSS(track.info.duration)} | Ends <t:${Math.floor((Date.now() + track.info.duration) / 1000)}:R>`,
        `> - **Source:** ${track.info.sourceName}`,
        `> - **Requester:** <@${(track.requester as CustomRequester).id}>`,
        track.pluginInfo?.clientData?.fromAutoplay ? `> *From Autoplay* ✅` : undefined
      ].filter(v => typeof v === "string" && v.length).join("\n").substring(0, 4096)} />)



  }).on("trackEnd", (player, track, payload) => {
    if (!track) return;
    logger.info(`Guild ${player.guildId} -- Finished Playing: ${track.info.title} -- Reason: ${payload}`);
  }).on("trackError", (player, track, payload) => {
    if (!track) return;
    logger.error(`Guild ${player.guildId} -- Error while Playing: ${track.info.title} -- Error: ${payload}`);
  }).on("trackStuck", (player, track, payload) => {
    if (!track) return;
    logger.warn(`Guild ${player.guildId} -- Track Stuck while Playing: ${track.info.title} -- Stuck Data: ${payload}`);
  }).on("queueEnd", (player, track, payload) => {
    if (!track) return;
    logger.info(`Guild ${player.guildId} -- Queue Ended`);
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return;
    reacord.createChannelMessage(channel.id).render(<EmbedMessage title="Queue Ended" />)
  }).on("playerUpdate", (player) => {
    // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
  });
}