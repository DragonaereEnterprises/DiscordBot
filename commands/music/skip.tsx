import type { ChatInputCommandInteraction, Client, CommandInteraction, GuildMember } from "discord.js";
import type { Command } from "../../types";
import type { LavalinkManager } from "lavalink-client";
import type { ReacordDiscordJs } from "reacord";
import { EmbedError, EmbedMessage } from "../../components/Embed";

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
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager) => {
    const chatInputInteraction = interaction as ChatInputCommandInteraction;
    if(!interaction.guildId) return;

    const vcId = (interaction.member as GuildMember)?.voice?.channelId;
    if(!vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="Join a voice chat" />);
    
    const player = lavalink.getPlayer(interaction.guildId);
    if(!player) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="I'm not connected" />);
    
    if(player.voiceChannelId !== vcId) return reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="We need to be in the same Voice Channel" />);
    
    if(!player.queue.current) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="I'm not playing anything" /> );
    
    const current = player.queue.current;
    const nextTrack = player.queue.tracks[0];
    
    if(!nextTrack) return reacord.createInteractionReply(interaction).render(<EmbedMessage description="No Tracks to skip to" />);

    await player.skip(chatInputInteraction.options.getInteger("skipto") || 0);

    reacord.createInteractionReply(interaction).render(<EmbedMessage description={current ? 
        `Skipped [\`${current?.info.title}\`](<${current?.info.uri}>) -> [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)` :
        `Skipped to [\`${nextTrack?.info.title}\`](<${nextTrack?.info.uri}>)`} /> );
  }
}