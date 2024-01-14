import { CommandInteraction, Client, TextChannel } from "discord.js";
import { Command } from "../../types";
import { ReacordDiscordJs } from "reacord";
import { EmbedMessage, EmbedError, EmbedDefaultError } from "../../components/Embed";
import React from "react";
import ms from "ms";

export const Purge: Command = {
  adminOnly: true,
  ownerOnly: false,
  category: 2,
  name: 'purge',
  description: 'Clear the chat of a defined ammount of messages',
  options: [
    {
      name: 'number',
      description: 'Number of messages to purge',
      required: true,
      type: 4,

    },
  ],
  run: async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs) => {
    const channel = interaction.channel as TextChannel;
    if (!channel.isDMBased) return
    if (!interaction.isChatInputCommand()) return
    const amount = interaction.options.getInteger('number', true)
    if (amount > 100) 
      return reacord.ephemeralReply(interaction, <EmbedError description="You can only purge 100 messages at a time." />);
    const messages = await channel.messages.fetch({ 
        limit: amount + 1,
    });
    const filtered = messages?.filter(
      (msg) => Date.now() - msg.createdTimestamp < ms("14 days")
    );
    if (filtered === undefined)
      return reacord.ephemeralReply(interaction, <EmbedDefaultError />);
    reacord.ephemeralReply(interaction, <EmbedMessage title="Purge" description={`Purged ${filtered.size - 1} messages.`} />);
    await channel.bulkDelete(filtered);
  },
};