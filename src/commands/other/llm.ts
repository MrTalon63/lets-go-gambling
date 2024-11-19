import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message, args) => {
	const loadingMessage = await message.reply("<a:loading_blocks:1308549135951073340>");
	const prompt = args.join(" ");
	if (!prompt) {
		message.channel.send("Podaj tekst do przetworzenia.");
		return;
	}

	let req;
	try {
		req = await fetch(`https://text.pollinations.ai/${prompt}`);
	} catch {
		loadingMessage.edit("Wystąpił błąd podczas generowania odpowiedzi");
		return;
	}

	if (!req.ok) {
		loadingMessage.edit("Wystąpił błąd podczas generowania odpowiedzi");
		return;
	}

	const res = await req.text();
	if (!res) {
		loadingMessage.edit("Wystąpił błąd podczas generowania odpowiedzi");
		return;
	}

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("LLM")
		.setDescription(res)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});

	loadingMessage.edit({ embeds: [embed], content: "" });
};

export const name = "llm";
export const aliases = ["largelanguagemodel"];
export const description = "Send request to LLM";
