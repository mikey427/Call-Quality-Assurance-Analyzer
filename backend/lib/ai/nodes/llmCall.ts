import { SystemMessage } from "@langchain/core/messages";
import { model } from "../model.js";
import { CallAnalysisSchema } from "../graph.js";

export function createNode (systemPrompt: string) {
	return async (state: any) => {
		const modelWithStructuredOutput = model.withStructuredOutput(CallAnalysisSchema)
		const response = await modelWithStructuredOutput.invoke([
			new SystemMessage(systemPrompt),
			...state.messages,
		])
		return { messages: [response ]};
	}
}