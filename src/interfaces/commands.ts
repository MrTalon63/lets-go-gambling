import { Message, OmitPartialGroupDMChannel } from "discord.js";

import Bot from "../client";

export interface Command {
	name: string;
	aliases: string[];
	description: string;
	run: RunFunction;
}

export interface RunFunction {
	(client: Bot, message: OmitPartialGroupDMChannel<Message>, args: string[]): Promise<void>;
}
