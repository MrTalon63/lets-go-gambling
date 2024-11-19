import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";
import { User } from "../../types";

export const run: RunFunction = async (client, message, args) => {
	let userData: User;
	let title = "Twoje saldo";
	if (args[0] && client.getUserFromMention(args[0])) {
		const user = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [client.getUserFromMention(args[0])?.id]);
		if (user.rowCount === 0) {
			message.reply("Nie znaleziono użytkownika");
			return;
		}
		userData = user.rows[0];
		title = `Saldo użytkownika ${message.guild?.members.cache.get(user.rows[0].udid)?.user.tag}`;
	} else {
		const user = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [message.author.id]);
		if (user.rowCount === 0) {
			message.reply("Nie znaleziono użytkownika");
			return;
		}
		userData = user.rows[0];
	}

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle(title)
		.addFields([
			{
				name: "Gotówka:",
				value: `${userData.balance}zł`,
				inline: true,
			},
			{
				name: `Stan konta:`,
				value: `${userData.bank_balance}zł`,
				inline: true,
			},
			{
				name: `Łączna wartość:`,
				value: `${parseInt(userData.balance) + parseInt(userData.bank_balance)}zł`,
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

export const name = "balance";
export const aliases = ["bal"];
export const description = "Returns the balance of the user";
