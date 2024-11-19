import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";
import { User } from "../../types";

export const run: RunFunction = async (client, message, args) => {
	const payer = message.author;
	const payee = client.getUserFromMention(args[0]);
	const amount = parseInt(args[1]);
	if (!payee || isNaN(amount)) {
		message.reply("Użycie: `pay <użytkownik | id> <kwota>`");
		return;
	}

	const payerQuery = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [payer.id]);
	if (payerQuery.rowCount === 0) {
		message.reply("Nie znaleziono użytkownika");
		return;
	}
	const payerData = payerQuery.rows[0] as User;

	if (parseInt(payerData.bank_balance) < amount) {
		message.reply("Nie masz tyle pieniędzy na koncie!");
		return;
	}

	await client.db("UPDATE gamblebot.users SET bank_balance = bank_balance - $1 WHERE udid = $2", [amount, payer.id]);
	await client.db("UPDATE gamblebot.users SET bank_balance = bank_balance + $1 WHERE udid = $2", [amount, payee.id]);

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Dodano pieniądze")
		.setDescription(`Przelano ${amount}zł do ${payee.tag}`)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});

	message.channel.send({ embeds: [embed] });
};

export const name = "pay";
export const aliases = ["give", "daj", "przelej"];
export const description = "Pay money to user";
