import { Client, CommandInteraction, CommandInteractionOptionResolver, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../types";
import { EQList, LavalinkManager, LavalinkPlugins, SearchResult } from "lavalink-client";
import { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";
import React from "react"; 

export const Filters: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'filters',
  description: 'Toggle Filters',
  options: [
    {
      name: 'filter',
      description: 'What Filter to toggle enabled/disabled',
      required: true,
      type: 3,
      choices: [
        { name: "Clear Filters", value: "clear" },
        { name: "Nightcore", value: "nightcore" },
        { name: "Vaporwave", value: "vaporwave" },
        { name: "LowPass", value: "lowpass" },
        { name: "Karaoke", value: "karaoke" },
        { name: "Rotation", value: "rotation" },
        { name: "Tremolo", value: "tremolo" },
        { name: "Vibrato", value: "vibrato" },
        // { name: "Echo (N/A)", value: "echo" }, // available in lavalink-filters lavalink-plugin (currently not working in lavalink-v4)
        // { name: "Reverb (N/A)", value: "reverb" }, // available in lavalink-filters lavalink-plugin (currently not working in lavalink-v4)
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
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction, { ephemeral: true}).render(<EmbedMessage description="I'm not playing anything" /> );

    let string = "";
    switch((interaction.options as CommandInteractionOptionResolver).getString("filter")) {
      case "clear": await player.filterManager.resetFilters(); string = "Disabled all Filter-Effects"; break;
      case "lowpass": await player.filterManager.toggleLowPass(); string = player.filterManager.filters.lowPass ? "Applied Lowpass Filter-Effect" : "Disabled Lowpass Filter-Effect"; break;
      case "nightcore": await player.filterManager.toggleNightcore(); string = player.filterManager.filters.nightcore ? "Applied Nightcore Filter-Effect, ||disabled Vaporwave (if it was active)||" : "Disabled Nightcore Filter-Effect"; break;
      case "vaporwave": await player.filterManager.toggleVaporwave(); string = player.filterManager.filters.vaporwave ? "Applied Vaporwave Filter-Effect, ||disabled Nightcore (if it was active)||" : "Disabled Vaporwave Filter-Effect"; break;
      case "karaoke": await player.filterManager.toggleKaraoke(); string = player.filterManager.filters.karaoke ? "Applied Karaoke Filter-Effect" : "Disabled Karaoke Filter-Effect"; break;
      case "rotation": await player.filterManager.toggleRotation(); string = player.filterManager.filters.rotation ? "Applied Rotation Filter-Effect" : "Disabled Rotation Filter-Effect"; break;
      case "tremolo": await player.filterManager.toggleTremolo(); string = player.filterManager.filters.tremolo ? "Applied Tremolo Filter-Effect" : "Disabled Tremolo Filter-Effect"; break;
      case "vibrato": await player.filterManager.toggleVibrato(); string = player.filterManager.filters.vibrato ? "Applied Vibrato Filter-Effect" : "Disabled Vibrato Filter-Effect"; break;
      // NOT WORKING?
      // case "echo": await player.filterManager.lavalinkLavaDspxPlugin.toggleEcho(); string = player.filterManager.filters.lavalinkLavaDspxPlugin.echo ? "Applied Echo Filter-Effect" : "Disabled Echo Filter-Effect"; break;
      // case "highPass": await player.filterManager.lavalinkLavaDspxPlugin.toggleHighPass(); string = player.filterManager.filters.lavalinkLavaDspxPlugin.highPass ? "Applied HighPass Filter-Effect" : "Disabled HighPass Filter-Effect"; break;
      // case "lowPass": await player.filterManager.lavalinkLavaDspxPlugin.toggleLowPass(); string = player.filterManager.filters.lavalinkLavaDspxPlugin.lowPass ? "Applied LowPass Filter-Effect" : "Disabled LowPass Filter-Effect"; break;
      // case "normalization": await player.filterManager.lavalinkLavaDspxPlugin.toggleNormalization(); string = player.filterManager.filters.lavalinkLavaDspxPlugin.normalization ? "Applied Normalization Filter-Effect" : "Disabled Normalization Filter-Effect"; break;
    }
    reacord.createInteractionReply(interaction).render(<EmbedMessage title={string} />);
  }
}