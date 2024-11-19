import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message, args) => {
	const prompt = args.join(" ");
	if (!prompt) {
		message.channel.send("Podaj tekst do przetworzenia.");
		return;
	}

	let req;
	try {
		req = await fetch(`https://text.pollinations.ai/${prompt}`);
	} catch {
		message.reply("Wystąpił błąd podczas generowania odpowiedzi");
		return;
	}

	if (!req.ok) {
		message.reply("Wystąpił błąd podczas generowania odpowiedzi");
		return;
	}

	const res = await req.text();

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("LLM")
		.setDescription(res)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});

	message.channel.send({ embeds: [embed] });
};

export const name = "llm";
export const aliases = ["largelanguagemodel"];
export const description = "Send request to LLM";