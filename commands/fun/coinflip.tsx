import type { CommandInteraction, Client } from "discord.js";
import type { Command } from "../../types";
import type { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";

export const CoinFlip: Command = {
  adminOnly: false,
  ownerOnly: false,
  category: 3,
  name: 'coinflip',
  description: 'Flip a coin',
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    function generateResponse() {
      const flipVariable = Math.random();
      if (flipVariable < .5) {
        return 'Heads'
      }
      else {
        return 'Tails'
      }
    }
    reacord.createInteractionReply(interaction).render(<EmbedMessage title="Coin Flip" description={`${generateResponse()}`} />);
  }
};