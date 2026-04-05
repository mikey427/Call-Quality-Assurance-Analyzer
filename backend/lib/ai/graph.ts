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
import { loadInstructionsFromFiles } from "../utils.js";
import { CallAnalysisSchema, scoreCategorySchema, phaseClassifierSchema, turnAnnotatorSchema } from "./schemas.js";

const instructionSet = await loadInstructionsFromFiles();

const PipelineState = new StateSchema({
  transcript: z.string().default(""),

  // phaseClassifier output → consumed by all eval nodes + turnAnnotator
  phasedTurns: phaseClassifierSchema.optional(),

  // each eval node writes its own field independently (safe for parallel execution)
  professionalismScore: scoreCategorySchema.optional(),
  callManagementScore: scoreCategorySchema.optional(),
  accuracyScore: scoreCategorySchema.optional(),
  callerExperienceScore: scoreCategorySchema.optional(),

  // turnAnnotator output → consumed by finalAnalysis
  annotatedTurns: turnAnnotatorSchema.optional(),

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
	.addNode("phaseClassifier", createNode(instructionSet.node1, 1))
	.addNode("professionalismEval", createNode(instructionSet.node2, 2))
	.addNode("callManagementEval", createNode(instructionSet.node3, 3))
	.addNode("accuracyEval", createNode(instructionSet.node4, 4))
	.addNode("callExperienceEval", createNode(instructionSet.node5, 5))
	.addNode("turnAnnotator", createNode(instructionSet.node6, 6))
	.addNode("finalAnalysis", createNode(instructionSet.node7, 7))
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
