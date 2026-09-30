import type { ChatInputCommandInteraction, Client, CommandInteraction, GuildMember } from "discord.js";
import type { Command } from "../../types";
import type { LavalinkManager } from "lavalink-client";
import type { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";

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
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    const chatInputInteraction = interaction as ChatInputCommandInteraction;
    if(!interaction.guildId) return;
    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);

    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );
    
    await player.setRepeatMode(chatInputInteraction.options.getString("repeatmode") as "off" | "track" | "queue");

    reacord.createInteractionReply(interaction).render(<EmbedMessage title={`Set repeat mode to ${player.repeatMode}`} />);
    }
}