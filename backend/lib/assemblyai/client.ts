import { AssemblyAI } from "assemblyai";

const baseUrl = "https://api.assemblyai.com";

const client = new AssemblyAI({
	apiKey: process.env.ASSEMBLY_AI_API_KEY!,
	baseUrl: baseUrl,
});

export async function transcribeFile(fileUrl: string) {
	const params = {
		audio: fileUrl,
		speech_models: ["universal-3-pro", "universal-2"],
		language_detection: true,
		speaker_labels: true,
	};

	const transcript = await client.transcripts.transcribe(params);

	if (transcript.status === "error") {
		throw new Error(`Transcription failed: ${transcript.error}`);
	}

	return transcript;
}
