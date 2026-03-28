import { SystemMessage } from "@langchain/core/messages";
import { modelWithTools } from "../model";

export const llmCall = async (state: any) => {
  const response = await modelWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    ),
    ...state.messages,
  ]);
  return {
    messages: [response],
    llmCalls: 1,
  };
};