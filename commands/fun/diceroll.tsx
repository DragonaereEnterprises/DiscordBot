import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";
import React from "react";

import { randomNumber } from "@andrewdragon/utils";

export const DiceRoll: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 3,
  name: 'diceroll',
  description: 'Roll a Die',
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    reacord.reply(interaction, <EmbedMessage title="Dice Roll" description={`${randomNumber(1, 6)}`} />);
  },
};