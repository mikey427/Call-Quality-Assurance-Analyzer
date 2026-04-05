import { drizzle } from 'drizzle-orm/neon-http';
import { call, user } from "./schema.js"
import { eq } from 'drizzle-orm';

export const db = drizzle(process.env.DATABASE_URL!);

export async function createNewAnalysis(userId: string, s3Key: string) {
	const newRecord = await db.insert(call).values({
		userId,
		status: "in_progress",
		s3Key,
	 }).returning();

	 return newRecord[0]
}

export async function updateAnalysisRecord(recordId: string, analysisData?: object | null, assemblyData?: object | null, status?: string){
	const updatedData = {
		...(analysisData && { analysisData }),
		...(assemblyData && { assemblyData }),
		...(status && { status }),
	}
	const updatedRecord = await db.update(call).set(updatedData).where(eq(call.id, recordId)).returning();

	return updatedRecord
}

export async function retrieveUserCallHistory(userId: string) {
	const historyRecords = await db.select().from(call).where(eq(call.userId, userId))

	return historyRecords
}