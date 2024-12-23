import { Client, Collection, GatewayIntentBits, User, Options } from "discord.js";
import { glob } from "glob";
import path from "path";

import db from "./utils/db";
import logger from "./utils/logger";

import { Command } from "./interfaces/commands";
import { Event } from "./interfaces/events";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require("../package.json");

class Bot extends Client {
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public readonly version = pkg.version;
	public readonly prefix = process.env.PREFIX!;
	public readonly owner = process.env.OWNER;
	public log = logger;
	public db = db;

	public constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessageReactions],
			makeCache: Options.cacheWithLimits(),
		});
	}

	public async start(): Promise<void> {
		this.log.info("Logging in with token...");
		this.login(process.env.TOKEN);

		this.log.info("Loading commands...");
		const commandFiles: string[] = await glob(`${__dirname}/commands/**/*{.ts,.js}`);
		commandFiles.map(async (fileName: string) => {
			const filePath = path.resolve(fileName);
			const file: Command = await import(filePath);
			this.commands.set(file.name, file);
			if (file.aliases) file.aliases.map((alias) => this.commands.set(alias, file));
		});

		this.log.info("Loading events...");
		const eventFiles: string[] = await glob(`${__dirname}/events/**/*{.ts,.js}`);
		eventFiles.map(async (fileName: string) => {
			const filePath = path.resolve(fileName);
			const file: Event = await import(filePath);
			this.events.set(file.name, file);
			this.on(file.event, file.run.bind(this, this));
		});

		this.log.info("Initialization complete!");
	}

	public getUserFromMention(mention: string): User | undefined {
		if (!mention) return;
		if (mention.startsWith("<@") && mention.endsWith(">")) {
			mention = mention.slice(2, -1);
			if (mention.startsWith("!")) {
				mention = mention.slice(1);
			}
		}
		return this.users.cache.get(mention);
	}
}

export default Bot;
