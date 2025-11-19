import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedDefaultError, EmbedMessage } from "../../components/Embed";
import React from "react"

export const CheckNSFW: Command = {
  adminOnly: true,
  ownerOnly: false,
  category: 1,
  name: 'checknsfw',
  description: 'Check the Servers NSFW Level',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    const nsfwLevel = interaction.guild?.nsfwLevel;
    const nsfwLevelName = ["Default", "Explicit", "Safe", "Age Restricted"];
    if (nsfwLevel === undefined)
      return reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedDefaultError />);
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedMessage title="NSFW Level" description={nsfwLevelName[nsfwLevel]} />);
  },
};