import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs, Embed, Button } from "reacord";
import React from "react";

export const DisplayName: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 5,
  name: 'help',
  description: 'Stop it. Get some help.',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    reacord.createInteractionReply(interaction).render(interaction.user.displayName)
  },
};