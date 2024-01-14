import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";
import React from "react";

function turnBotOff(){
  process.exit(100);
}

export const ShutDown: Command = {
  adminOnly: false,
  ownerOnly: true,
  category: 0,
  name: 'shutdown',
  description: 'Shuts the bot down',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    reacord.ephemeralReply(interaction, <EmbedMessage title="Shutting Down" description="Have a good day" />);
    setTimeout(turnBotOff,1000);
  },
};