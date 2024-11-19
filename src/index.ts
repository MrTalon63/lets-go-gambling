import Bot from "./client";
import logger from "./utils/logger";

logger.info("[Discord.js] Starting bot...");
const client = new Bot();
client.start().catch((error) => {
	logger.error(error);
	process.exit(1);
});
