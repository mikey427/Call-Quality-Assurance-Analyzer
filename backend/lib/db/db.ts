import { drizzle } from 'drizzle-orm/neon-http';
import { call } from "./schema.js"

export const db = drizzle(process.env.DATABASE_URL!);

export async function createNewAnalysis(userId: string, s3Key: string) {
	const newRecord = await db.insert(call).values({
		userId,
		status: "in_progress",
		s3Key,
	 }).returning();

	 return newRecord[0]
}