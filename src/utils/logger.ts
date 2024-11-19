import pino from "pino";

let transport;

if (process.env.NODE_ENV === "production") {
	transport = pino.transport({
		target: "pino-loki",
		level: process.env.LOG_LEVEL || "info",
		options: {
			batching: true,
			interval: 5,
			host: process.env.LOKI_HOST,
			basicAuth: {
				username: process.env.LOKI_USER,
				password: process.env.LOKI_PASS,
			},
			labels: {
				app: "LetsGoGambling",
			},
		},
	});
} else {
	transport = pino.transport({
		target: "pino-pretty",
		level: process.env.LOG_LEVEL || "info",
		options: {
			colorize: true,
		},
	});
}

const logger = pino(transport);

export default logger;
