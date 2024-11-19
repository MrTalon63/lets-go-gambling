import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../interfaces/commands";

export const run: RunFunction = async (client, message) => {
	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Pong!")
		.addFields([
			{
				name: "Discord API ping:",
				value: `${Math.round(message.client.ws.ping)} ms`,
				inline: true,
			},
			{
				name: `Bot ping:`,
				value: `${Math.round(Date.now() - message.createdTimestamp)} ms`,
				inline: true,
			},
			{
				name: `Aktualna wersja:`,
				value: client.version,
				inline: true,
			},
			{
				name: `Prefix:`,
				value: client.prefix,
				inline: true,
			},
			{
				name: `Ilość użytkowników:`,
				value: message.guild?.memberCount.toString(),
				inline: true,
			},
		])
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});
	message.channel.send({ embeds: [embed] });
};

export const name = "info";
export const aliases = ["p", "ping"];
export const description = "Ping!";
