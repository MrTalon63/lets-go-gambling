import korwin from "korwinjs";

import { RunFunction } from "../../interfaces/commands";

export const run: RunFunction = async (client, message) => {
	message.reply(await korwin());
};

export const name = "korwin";
export const description = "Korwin wypowiedź";
