import { ChatInputCommandInteraction, Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../types";
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";
import { formatMS_HHMMSS } from "../../utils/Time";

export const Seek: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'seek',
  description: 'Seek some Music',
  options: [
    {
      name: 'position',
      description: 'What position to seek to? (in seconds)',
      required: true,
      type: 4,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    const chatInputInteraction = interaction as ChatInputCommandInteraction;
    if(!interaction.guildId) return;

    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);
    
    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );

    const position = (chatInputInteraction.options.getInteger("position") as number) * 1000;

    if (position >= player.queue.current.info.duration) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Position can't be longer than the song" />);
    if  (position < 0) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Position can't be negative" />);
    
    await player.seek(position);

    reacord.createInteractionReply(interaction).render(<EmbedMessage title={`Seeked to ${formatMS_HHMMSS(player.position)} seconds`} /> );
  }
}