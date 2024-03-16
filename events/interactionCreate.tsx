import { CommandInteraction, Client, Interaction, PermissionsBitField, GuildMember } from "discord.js";
import { Commands } from "../Commands"
import { ReacordDiscordJs } from "reacord";
import { EmbedError } from "../components/Embed";
import React from "react";
import dotenv from 'dotenv';
import { LavalinkManager } from "lavalink-client/dist/types";
import { Command } from "../types";
dotenv.config();

export default (client: Client, reacord: ReacordDiscordJs, lavalink: LavalinkManager): void => {
	client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction, reacord, lavalink);
    }
  });
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction, reacord: ReacordDiscordJs, lavalink: LavalinkManager): Promise<void> => {
  const member = interaction.member as GuildMember;
  const slashCommand = Commands.find(c => c.name === interaction.commandName) as Command;
  if (!slashCommand || !interaction.channel || !interaction.channel.isDMBased){
    reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="An error has occurred" />);
  }
  if (interaction.member === null){
    reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="You must be a member of this server" />);
  }
  if (slashCommand.ownerOnly === true && interaction.user.id != process.env.OWNER_ID){
    reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="You must be the Bot Owner to run this Command" />);
  }
  if (slashCommand.adminOnly === true && !member.permissions.has(PermissionsBitField.Flags.Administrator)){
    reacord.createInteractionReply(interaction, { ephemeral: true }).render(<EmbedError description="You must be a Server Admin to run this Command" />);
  }

  slashCommand.run(client, interaction, reacord, lavalink);
};