import { SystemMessage } from "@langchain/core/messages";
import { modelWithTools } from "../model";

function createNode (systemPrompt: string) {
	return async (state: any) => {
		const response = await modelWithTools.invoke([
			new SystemMessage(systemPrompt),
			...state.messages,
		])
		return { messages: [response ]};
	}
}