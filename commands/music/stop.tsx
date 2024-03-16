import { CommandInteraction, Client, GuildMember } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";
import { LavalinkManager } from "lavalink-client";

export const Stop: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'stop',
  description: 'Stops the Music',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    if(!interaction.guildId) return;

    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);
    
    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );
    
    await player.destroy(`${interaction.user.username} stopped the Player`);
    
    reacord.createInteractionReply(interaction).render(<EmbedMessage title="Stopped the player" /> );
  },
};