import { getPresignedUrl } from "./cloudflare/client.js";
import { createNewAnalysis, updateAnalysisRecord } from "./db/db.js";
import { transcribeFile } from "./assemblyai/client.js";
import { agent } from "./ai/graph.js";



export async function handleCallAnalysis(
	recordId: string,
	fileName: string,
) {

	if(!recordId || !fileName) {
		const error = new Error("Missing recordId or fileName")
		console.error(error.stack)
		throw error
	}

	const presignedUrl = await getPresignedUrl(fileName);

	const assemblyTranscript = await transcribeFile(presignedUrl);

	if (!assemblyTranscript.utterances) {
		throw new Error("Transcript has no utterances");
	}

	const transcript = assemblyTranscript.utterances.map((utterance: { speaker: string; text: string }) => {
		const speaker = utterance.speaker === "A" ? "Agent" : "Caller";
		return `[${speaker}]\n${utterance.text}`;
	}).join("\n\n");

	const result = await agent.invoke({ transcript });
	console.log("result: ", result)

	const newCallRecord = await updateAnalysisRecord(recordId, result, assemblyTranscript, "analysis_complete");

	return newCallRecord
}