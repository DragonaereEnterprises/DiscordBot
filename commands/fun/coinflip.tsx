import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";
import React from "react";

export const CoinFlip: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 3,
  name: 'coinflip',
  description: 'Flip a coin',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    function generateResponse() {
      let flipVariable = Math.random();
      if (flipVariable < .5) {
        return 'Heads'
      }
      else {
        return 'Tails'
      }
    }
    reacord.reply(interaction, <EmbedMessage title="Coin Flip" description={`${generateResponse()}`} />);
  }
};