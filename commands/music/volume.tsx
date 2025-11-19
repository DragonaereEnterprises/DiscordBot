import { Client, CommandInteraction, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Command } from "../../types";
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";

export const Volume: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'volume',
  description: 'Change the Volume',
  options: [
    {
      name: 'percentage',
      description: 'What Persent',
      required: true,
      type: 10,
    },
    {
      name: 'ignoredecrementer',
      description: 'Should the Decrementer be ignored?',
      required: false,
      type: 5,
    }
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    const chatInputInteraction = interaction as ChatInputCommandInteraction;
    if(!interaction.guildId) return;

    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);

    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);

    if(!player.queue.current) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not playing anything" />);

    const newVolume = (chatInputInteraction.options.getNumber("percentage") as number) * .7;
    const ignoreDecrementer = (chatInputInteraction.options.getBoolean("ignoredecrementer") as boolean) === true

    await player.setVolume(newVolume, ignoreDecrementer);

    reacord.createInteractionReply(interaction).render(<EmbedMessage title={`Changed volume to: ${chatInputInteraction.options.getNumber("percentage") as number}`}/> );
  },
}