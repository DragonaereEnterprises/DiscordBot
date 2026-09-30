import type { CommandInteraction, Client } from "discord.js";
import type { Command } from "../../types";
import type { ReacordDiscordJs } from "reacord";
import { EmbedMessage } from "../../components/Embed";

function turnBotOff(){
  process.exit(100);
}

export const ShutDown: Command = {
  adminOnly: false,
  ownerOnly: true,
  category: 0,
  name: 'shutdown',
  description: 'Shuts the bot down',
  run: async (_client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedMessage title="Shutting Down" description="Have a good day" />);
    setTimeout(turnBotOff,1000);
  },
};