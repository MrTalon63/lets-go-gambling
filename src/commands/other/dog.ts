import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message) => {
	const req = await fetch("https://api.thedogapi.com/v1/images/search", {
		headers: {
			"x-api-key": process.env.DOG_API_KEY || "",
			"content-type": "application/json",
		},
	});
	if (!req.ok) {
		message.reply("Wystąpił błąd podczas pobierania obrazka psa");
		return;
	}
	const data = await req.json();

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Pies")
		.setImage(data[0].url)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});
	message.channel.send({ embeds: [embed] });
};

export const name = "dog";
export const aliases = ["pies"];
export const description = "Generate random dog image";
