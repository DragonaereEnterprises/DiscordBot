import type { Client, CommandInteraction, GuildMember } from "discord.js";
import type { Command } from "../../types";
import type { ReacordDiscordJs } from "reacord";
import type { LavalinkManager } from "lavalink-client";
import { EmbedError, EmbedMessage } from "../../components/Embed";

export const Pause: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 6,
  name: 'pause',
  description: 'Pause the current track',
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    if(!interaction.guildId) return;
    
    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);

    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);

    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );

    await player.pause();

    reacord.createInteractionReply(interaction).render(<EmbedMessage title="Paused the player" /> );
  }
}