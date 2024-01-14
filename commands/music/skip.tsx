import { Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../types";
import { LavalinkManager, SearchResult } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";

export const Skip: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'skip',
  description: 'Skip the current track',
  options: [
    {
      name: 'tracks',
      description: 'How many tracks to skip?',
      required: false,
      type: 4,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    if(!interaction.guildId) return;

    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.ephemeralReply(interaction, <EmbedError description="Join a voice chat" />);
    
    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.ephemeralReply(interaction, <EmbedError description="I'm not connected" />);
    
    if(player.voiceChannelId !== vcId) return reacord.ephemeralReply(interaction, <EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.reply(interaction, <EmbedMessage description="I'm not playing anything" /> );
    
    const current = player.queue.current;
    const nextTrack = player.queue.tracks[0];
    
    if(!nextTrack) return reacord.reply(interaction, <EmbedMessage description="No Tracks to skip to" />);

    await player.skip((interaction.options as CommandInteractionOptionResolver).getInteger("skipto") || 0);

    reacord.reply(interaction, <EmbedMessage description={current ? 
        `Skipped [\`${current?.info.title}\`](<${current?.info.uri}>) -> [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)` :
        `Skipped to [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)`} /> );
  }
}