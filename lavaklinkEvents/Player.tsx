import { TextChannel } from "discord.js";
import { BotClient, CustomRequester } from "../types";
import { formatMS_HHMMSS } from "../utils/Time";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../components/Embed";
import React from "react";
import { LavalinkManager } from "lavalink-client/dist/types";
import logger from '../logger';

export function PlayerEvents(client:BotClient, reacord: ReacordDiscordJs, lavalink: LavalinkManager) {
    /**
     * PLAYER EVENTS
     */
  lavalink.on("playerCreate", (player) => {
    logger.info(player.guildId, " :: Created a Player :: ");
  }).on("playerDestroy", (player, reason) => {
    logger.info(player.guildId, " :: Player got Destroyed :: ");
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return logger.warn("No Channel?", player);
  }).on("playerDisconnect", (player, voiceChannelId) => {
    logger.info(player.guildId, " :: Player disconnected the Voice Channel :: ", voiceChannelId);
  }).on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
    logger.info(player.guildId, " :: Player moved from Voice Channel :: ", oldVoiceChannelId, " :: To ::", newVoiceChannelId);
  }).on("playerSocketClosed", (player, payload) => {
    logger.info(player.guildId, " :: Player socket got closed from lavalink :: ", payload);
  })

  /**
   * Queue/Track Events
   */
  lavalink.on("trackStart", (player, track) => {
    logger.info(player.guildId, " :: Started Playing :: ", track.info.title, "QUEUE:", player.queue.tracks.map(v => v.info.title));
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    const url = track.info.artworkUrl || track.pluginInfo?.artworkUrl as string
    if(!channel) return;
    reacord.send(channel.id, <EmbedMessage 
      title={`${track.info.title}`.substring(0, 256)} 
      url={track.info.uri}
      thumbnail={{url} || undefined}
      description={[
        `> - **Author:** ${track.info.author}`,
        `> - **Duration:** ${formatMS_HHMMSS(track.info.duration)} | Ends <t:${Math.floor((Date.now() + track.info.duration) / 1000)}:R>`,
        `> - **Source:** ${track.info.sourceName}`,
        `> - **Requester:** <@${(track.requester as CustomRequester).id}>`,
        track.pluginInfo?.clientData?.fromAutoplay ? `> *From Autoplay* ✅` : undefined
      ].filter(v => typeof v === "string" && v.length).join("\n").substring(0, 4096)} />)



  }).on("trackEnd", (player, track, payload) => {
    logger.info(player.guildId, " :: Finished Playing :: ", track.info.title)
  }).on("trackError", (player, track, payload) => {
    logger.error(player.guildId, " :: Errored while Playing :: ", track.info.title, " :: ERROR DATA :: ", payload)
  }).on("trackStuck", (player, track, payload) => {
    logger.warn(player.guildId, " :: Got Stuck while Playing :: ", track.info.title, " :: STUCKED DATA :: ", payload)
      
  }).on("queueEnd", (player, track, payload) => {
    logger.info(player.guildId, " :: No more tracks in the queue, after playing :: ", track.info.title)
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return;
    reacord.send(channel.id, <EmbedMessage title="Queue Ended" />)
  }).on("playerUpdate", (player) => {
    // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
  });
}