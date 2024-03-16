import { Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../types";
import { LavalinkManager, SearchResult } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";

export const Play: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'play',
  description: 'Play some Music',
  options: [
    {
      name: 'query',
      description: 'What to play?',
      required: true,
      type: 3,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    if(!interaction.guildId) return;
    
    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);

    const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
    if(!vc.joinable || !vc.speakable) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I am not allowed to speak in this channel" />);
    
    const src = "youtube";
    const query = (interaction.options as CommandInteractionOptionResolver).getString("query") as string;
    
    if(query === "nothing_found") return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="No tracks found" />);
    if(query === "join_vc") return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join the voice chat but failed to play. Please try again" />);

    const player = lavalink.getPlayer(interaction.guildId) || lavalink.createPlayer({
      guildId: interaction.guildId,
      voiceChannelId: vcId,
      textChannelId: interaction.channelId,
      selfDeaf: true,
      selfMute: false,
      volume: 70,
      instaUpdateFiltersFix: true,
      applyVolumeAsFilter: false,
    });

    const connected = player.connected;

    if(!connected) await player.connect();

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same voice chat" />);
    
    const response = (await player.search({ query: query, source: src }, interaction.user)) as SearchResult;
    if(!response || !response.tracks?.length) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="No tracks found" />);

    await player.queue.add(response.loadType === "playlist" ? response.tracks : response.tracks[0]);

    reacord.createInteractionReply(interaction).render(<EmbedMessage description={response.loadType === "playlist"
    ? `Added ${response.tracks.length} Tracks${response.playlist?.title ? ` - from the ${response.pluginInfo.type || "Playlist"} ${response.playlist.uri ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)` : `\`${response.playlist.title}\``}` : ""} at \`#${player.queue.tracks.length - response.tracks.length}\``
    : `Added [\`${response.tracks[0].info.title}\`](<${response.tracks[0].info.uri}>) by \`${response.tracks[0].info.author}\` at \`#${player.queue.tracks.length}\``} />);

    if(!player.playing) await player.play(connected ? { volume: 70, paused: false } : undefined);
  }
}