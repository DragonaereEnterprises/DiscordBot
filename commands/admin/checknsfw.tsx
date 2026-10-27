import type { CommandInteraction, Client } from "discord.js";
import type { Command } from "../../types";
import type { ReacordDiscordJs } from "reacord";
import { EmbedDefaultError, EmbedMessage } from "../../components/Embed";

export const CheckNSFW: Command = {
  adminOnly: true,
  ownerOnly: false,
  category: 1,
  name: 'checknsfw',
  description: 'Check the Servers NSFW Level',
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    const nsfwLevel = interaction.guild?.nsfwLevel;
    const nsfwLevelName = ["Default", "Explicit", "Safe", "Age Restricted"];
    if (nsfwLevel === undefined)
      return reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedDefaultError />);
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedMessage title="NSFW Level" description={nsfwLevelName[nsfwLevel]} />);
  },
};