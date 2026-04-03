import {
	StateGraph,
	StateSchema,
	// MessagesValue,
	// ReducedValue,
	// GraphNode,
	// ConditionalEdgeRouter,
	START,
	END,
} from "@langchain/langgraph";
import { z } from "zod/v4";
import { createNode } from "./nodes/llmCall.js";
// import { toolNode } from "./nodes/toolNode.js";
// import { shouldContinue } from "./edges.js";
import { loadInstructionsFromFiles } from "../utils.js";

const instructionSet = await loadInstructionsFromFiles();

// const MessagesState = new StateSchema({
// 	messages: MessagesValue,
// 	llmCalls: new ReducedValue(z.number().default(0), {
// 		reducer: (x, y) => x + y,
// 	}),
// });

const confidenceSchema = z.object({
	score: z.number(),
	concerns: z.array(z.string()),
});

const scoreCategorySchema = z.object({
	score: z.number(),
	reasoning: z.string(),
	confidence: confidenceSchema,
});

export const CallAnalysisSchema = z.object({
	call_id: z.string(),
	analyzed_at: z.string(),
	metadata: z.object({
		agent_name: z.string(),
		call_label: z.string(),
		call_duration: z.string(),
		tags: z.array(z.string()),
	}),
	summary: z.string(),
	upsides: z.array(z.string()),
	downsides: z.array(z.string()),
	confidence: confidenceSchema,
	scores: z.object({
		professionalism: scoreCategorySchema,
		call_management: scoreCategorySchema,
		accuracy_and_completeness: scoreCategorySchema,
		caller_experience: scoreCategorySchema,
		overall: z.number(),
	}),
	turns: z.array(
		z.object({
			timestamp: z.string(),
			speaker: z.enum(["agent", "caller"]),
			text: z.string(),
			phase: z.enum([
				"pickup",
				"call_management",
				"message_taking",
				"closing",
			]),
			flags: z.array(z.string()),
			note: z.string(),
		}),
	),
});

const PipelineState = new StateSchema({
  transcript: z.string().default(""),

  // phaseClassifier output → consumed by all eval nodes + turnAnnotator
  phasedTurns: z.array(z.object({
    timestamp: z.string(),
    speaker: z.enum(["agent", "caller"]),
    text: z.string(),
    phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
  })).default([]),

  // each eval node writes its own field independently (safe for parallel execution)
  professionalismScore: scoreCategorySchema.optional(),
  callManagementScore: scoreCategorySchema.optional(),
  accuracyScore: scoreCategorySchema.optional(),
  callerExperienceScore: scoreCategorySchema.optional(),

  // turnAnnotator output → consumed by finalAnalysis
  annotatedTurns: z.array(z.object({
    timestamp: z.string(),
    speaker: z.enum(["agent", "caller"]),
    text: z.string(),
    phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
    flags: z.array(z.string()),
    note: z.string().nullable(),
  })).default([]),

  // finalAnalysis output → saved to DB as analysisData
  result: CallAnalysisSchema.optional(),
});


// export const agent = new StateGraph(MessagesState)
//   .addNode("llmCall", createNode(instructionSet.node1))
//   .addNode("toolNode", toolNode)
//   .addEdge(START, "llmCall")
//   .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
//   .addEdge("toolNode", "llmCall")
//   .compile();

export const agent = new StateGraph(PipelineState)
	.addNode("phaseClassifier", createNode(instructionSet.node1))
	.addNode("professionalismEval", createNode(instructionSet.node2))
	.addNode("callManagementEval", createNode(instructionSet.node3))
	.addNode("accuracyEval", createNode(instructionSet.node4))
	.addNode("callExperienceEval", createNode(instructionSet.node5))
	.addNode("turnAnnotator", createNode(instructionSet.node6))
	.addNode("finalAnalysis", createNode(instructionSet.node7))
  .addEdge(START, "phaseClassifier")
  .addEdge("phaseClassifier", "professionalismEval")
  .addEdge("phaseClassifier", "callManagementEval")
  .addEdge("phaseClassifier", "accuracyEval")
  .addEdge("phaseClassifier", "callExperienceEval")
  .addEdge("phaseClassifier", "turnAnnotator")
  .addEdge("professionalismEval", "finalAnalysis")
  .addEdge("callManagementEval", "finalAnalysis")
  .addEdge("accuracyEval", "finalAnalysis")
  .addEdge("callExperienceEval", "finalAnalysis")
  .addEdge("turnAnnotator", "finalAnalysis")
  .addEdge("finalAnalysis", END)
	.compile();
