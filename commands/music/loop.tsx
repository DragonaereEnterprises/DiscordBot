import { Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { Command } from "../../types";
import { LavalinkManager } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react";

export const Loop: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'loop',
  description: 'Set the Repeat Mode',
  options: [
    {
      name: 'repeatmode',
      description: 'How do you want to repeat?',
      required: true,
      type: 3,
      choices: [{ name: "Off", value: "off"}, { name: "Track", value: "track"}, { name: "Queue", value: "queue"}]
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
    
    await player.setRepeatMode((interaction.options as CommandInteractionOptionResolver).getString("repeatmode") as "off" | "track" | "queue");

    reacord.reply(interaction, <EmbedMessage title={`Set repeat mode to ${player.repeatMode}`} />);
    }
}