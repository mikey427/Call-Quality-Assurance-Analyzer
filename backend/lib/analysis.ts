import { getPresignedUrl } from "./cloudflare/client.js";
import { createNewAnalysis, updateAnalysisRecord } from "./db/db.js";
import { transcribeFile } from "./assemblyai/client.js";
import { agent } from "./ai/graph.js";
import type { Transcript } from 'assemblyai'


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

	const cleanedUpAssemblyAiData = cleanUpAssemblyAiData(assemblyTranscript);

	const newCallRecord = await updateAnalysisRecord(recordId, result, cleanedUpAssemblyAiData, "analysis_complete");

	return newCallRecord
}

function cleanUpAssemblyAiData(data: Transcript) {
	return {
		id: data.id,
		language_code: data.language_code,
		status: data.status,
		text: data.text,
		utterances: data.utterances?.map(utterance => ({
			speaker: utterance.speaker,
			text: utterance.text,
			confidence: utterance.confidence,
			start: utterance.start,
			end: utterance.end,
		})),
		confidence: data.confidence,
		speech_model_used: data.speech_model_used
	}
}