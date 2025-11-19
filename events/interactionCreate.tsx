import { CommandInteraction, Client, Interaction, PermissionsBitField, GuildMember } from "discord.js";
import { Commands } from "../Commands"
import { ReacordDiscordJs } from "reacord";
import { EmbedError } from "../components/Embed";
import React from "react";
import { LavalinkManager } from "lavalink-client/dist/index";
import { Command } from "../types";

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
  
  if (!slashCommand || !interaction.isChatInputCommand() || !interaction.channel || interaction.channel.isDMBased()) {
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedError description="An error has occurred" />);
    return;
  }
  if (interaction.member === null) {
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedError description="You must be a member of this server" />);
    return;
  }
  if (slashCommand.ownerOnly === true && interaction.user.id != process.env.OWNER_ID) {
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedError description="You must be the Bot Owner to run this Command" />);
    return;
  }
  if (slashCommand.adminOnly === true && !member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    reacord.createInteractionReply(interaction, { flags: "Ephemeral" }).render(<EmbedError description="You must be a Server Admin to run this Command" />);
    return;
  }

  slashCommand.run(client, interaction, reacord, lavalink);
};