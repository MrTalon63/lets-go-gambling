import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";
import { User } from "../../types";

export const run: RunFunction = async (client, message, args) => {
	if (!args[0]) {
		message.channel.send("Podaj kwotę którą chcesz wypłacić!");
		return;
	}
	const user = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [message.author.id]);
	if (user.rowCount === 0) {
		message.reply("Nie znaleziono użytkownika");
		return;
	}

	const userData: User = user.rows[0];
	const depAll = args[0] === "all";

	if (args[0] === "all") {
		await client.db("UPDATE gamblebot.users SET balance = balance + bank_balance, bank_balance = 0 WHERE udid = $1", [message.author.id]);
	} else {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) {
			message.reply("Niepoprawne argumenty");
			return;
		}
		if (parseInt(userData.bank_balance) < amount) {
			message.reply("Nie masz tyle na koncie!");
			return;
		}
		await client.db("UPDATE gamblebot.users SET balance = balance + $1, bank_balance = bank_balance - $1 WHERE udid = $2", [amount, message.author.id]);
	}

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Wypłacono pieniądze")
		.setDescription(`Wypłacono ${depAll ? `${userData.balance}zł` : `${args[0]}zł`} z banku`)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});
	message.channel.send({ embeds: [embed] });
};

export const name = "withdraw";
export const aliases = ["with", "wth", "wyplac"];
export const description = "Withdraw money from bank";
