import type { CommandInteraction, Client } from "discord.js";
import type { Command } from "../../types";
import type { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";

import { randomNumber } from "@andrewdragon/utils";

export const DiceRoll: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 3,
  name: 'diceroll',
  description: 'Roll a Die',
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    reacord.createInteractionReply(interaction).render(<EmbedMessage title="Dice Roll" description={`${randomNumber(1, 6)}`} />);
  },
};