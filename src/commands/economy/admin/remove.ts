import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../../interfaces/commands";

export const run: RunFunction = async (client, message, args) => {
	if (message.author.id !== client.owner) return;

	const user = client.getUserFromMention(args[0]);
	const amount = parseInt(args[1]);
	if (!user || isNaN(amount)) {
		message.reply("Użycie `remove <użytkownik | id> <kwota>`");
		return;
	}

	const userData = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [user.id]);
	if (userData.rowCount === 0) {
		message.reply("Nie znaleziono użytkownika");
		return;
	}

	await client.db("UPDATE gamblebot.users SET balance = balance - $1 WHERE udid = $2", [amount, user.id]);

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Zabrano pieniądze")
		.setDescription(`Zabrano ${amount}zł z konta użytkownika ${user.tag}`)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});

	message.channel.send({ embeds: [embed] });
};

export const name = "remove";
export const description = "Removes money from user";
