import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";

export const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const lastMessage = state.messages.at(-1);

  // Check if it's an AIMessage before accessing tool_calls
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // If the LLM makes a tool call, then perform an action
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // Otherwise, we stop (reply to the user)
  return END;
};