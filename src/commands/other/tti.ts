import { EmbedBuilder, AttachmentBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message, args) => {
	const prompt = args.join(" ");
	if (!prompt) {
		message.channel.send("Podaj tekst do przetworzenia.");
		return;
	}

	let req;
	try {
		req = await fetch(`https://image.pollinations.ai/prompt/${prompt}`);
	} catch {
		message.reply("Wystąpił błąd podczas generowania obrazka");
		return;
	}

	if (!req.ok) {
		message.reply("Wystąpił błąd podczas generowania obrazka");
		return;
	}

	const image = Buffer.from(await req.arrayBuffer());
	const atta = new AttachmentBuilder(image, { name: "tti.png" });

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Text to image")
		.setImage(`attachment://tti.png`)
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});

	message.channel.send({ embeds: [embed], files: [atta] });
};

export const name = "tti";
export const aliases = ["texttoimage", "text-to-image"];
export const description = "Text to images";
