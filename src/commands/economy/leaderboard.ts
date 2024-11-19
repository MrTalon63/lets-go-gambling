import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message) => {
	const balances = await client.db("SELECT udid, (COALESCE(balance,0) + COALESCE(bank_balance,0)) AS sums FROM gamblebot.users ORDER BY sums DESC", []);
	if (balances.rowCount === 0) {
		message.reply("Nie znaleziono użytkowników");
		return;
	}

	const top10 = balances.rows.slice(0, 10) as { udid: string; sums: string }[];
	await message.guild?.members.fetch();

	const filtered = top10.filter((user) => parseInt(user.sums) > 0);
	const fields = filtered.map((user, index) => ({
		name: `${index + 1}. ${client.getUserFromMention(user.udid)?.tag || "Nieznany użytkownik"}`,
		value: `Całkowite saldo: ${user.sums}zł`,
		inline: false,
	}));

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle(`Top 10 użytkowników serwera ${message.guild?.name}`)
		.setFields(fields)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});
	message.channel.send({ embeds: [embed] });
};

export const name = "leaderboard";
export const aliases = ["top"];
export const description = "Returns the balance of the user";
