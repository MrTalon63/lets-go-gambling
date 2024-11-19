import Bot from "./client";

console.info("Starting bot...");
const client = new Bot();
client.start().catch((error) => {
	console.error(error);
	process.exit(1);
});
