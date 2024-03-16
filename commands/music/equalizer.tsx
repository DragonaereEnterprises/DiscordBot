import { Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../types";
import { EQList, LavalinkManager, SearchResult } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react"; 

export const Equalizer: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'equalizer',
  description: 'Which Equalizer to apply/disabled',
  options: [
    {
      name: 'equalizer',
      description: 'How do you want to repeat?',
      required: true,
      type: 3,
      choices: [
        { name: "Clear Equlizers", value: "clear" },
        { name: "Bassboost (High)", value: "bass_high" },
        { name: "Bassboost (Medium)", value: "bass_medium" },
        { name: "Bassboost (Low)", value: "bass_low" },
        { name: "Rock", value: "rock" },
        { name: "Classic", value: "classic" },
        { name: "Pop", value: "pop" },
        { name: "Electronic", value: "electronic" },
      ]
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    if(!interaction.guildId) return;
    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);

    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );

    let string = "";
    switch((interaction.options as CommandInteractionOptionResolver).getString("equalizer")) {
      case "clear": await player.filterManager.clearEQ(); string = "Cleared all Equalizers"; break;
      case "bass_high": await player.filterManager.setEQ(EQList.BassboostHigh); string = "Applied the 'High Bassboost' Equalizer"; break;
      case "bass_medium": await player.filterManager.setEQ(EQList.BassboostMedium); string = "Applied the 'Medium Bassboost' Equalizer"; break;
      case "bass_low": await player.filterManager.setEQ(EQList.BassboostLow); string = "Applied the 'low Bassboost' Equalizer"; break;
      case "rock": await player.filterManager.setEQ(EQList.Rock); string = "Applied the 'Rock' Equalizer"; break;
      case "classic": await player.filterManager.setEQ(EQList.Classic); string = "Applied the 'Classic' Equalizer"; break;
      case "pop": await player.filterManager.setEQ(EQList.Pop); string = "Applied the 'Pop' Equalizer"; break;
      case "electronic": await player.filterManager.setEQ(EQList.Electronic); string = "Applied the 'Electronic' Equalizer"; break;
    }
    reacord.createInteractionReply(interaction).render(<EmbedMessage title={string} />);
  }
}