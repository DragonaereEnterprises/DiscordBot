import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";
import React from "react";

export const DiceRoll: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 3,
  name: 'diceroll',
  description: 'Roll a Die',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    function generateResponse() {
      let numberReturned = Math.floor(Math.random() * 6) + 1;
      return numberReturned;
    }
    reacord.reply(interaction, <EmbedMessage title="Dice Roll" description={`${generateResponse()}`} />);
  },
};