import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function query(text: string, params: any[]) {
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log("executed query", { text, duration, rows: res.rowCount });
	return res;
}

export default query;
