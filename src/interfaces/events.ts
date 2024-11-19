import Bot from "../client";

export interface Event {
	name: string;
	event: string;
	run: RunFunction;
}

export interface RunFunction {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(client: Bot, ...args: any[]): Promise<void>;
}
