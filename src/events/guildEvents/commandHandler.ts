import { OmitPartialGroupDMChannel, Message, Events } from "discord.js";

import { RunFunction } from "../../interfaces/events";

export const run: RunFunction = async (client, message: OmitPartialGroupDMChannel<Message>) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(client.prefix)) return;
	if (!message.guild) return;
	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
	const command = args.shift()?.toLowerCase() || "";
	const cmd = client.commands.get(command);
	if (!cmd) return;
	cmd.run(client, message, args);
};

export const name = "Command Handler";
export const event = Events.MessageCreate;
