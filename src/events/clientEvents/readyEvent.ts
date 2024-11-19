import { Events } from "discord.js";

import { RunFunction } from "../../interfaces/events";

export const run: RunFunction = async (client) => {
	client.log.info(`${client.user?.tag} is ready!`);
};

export const name = "Client ready";
export const event = Events.ClientReady;
