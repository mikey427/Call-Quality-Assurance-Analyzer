import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../model.js";
import { CallAnalysisSchema, scoreCategorySchema, phaseClassifierSchema, turnAnnotatorSchema } from "../schemas.js";

const nodeConfigs = {
			phaseClassifier: {
				schema: phaseClassifierSchema,
				input: "transcript",
				outputKey: "phasedTurns"
			},
			professionalismScore: {
				schema: scoreCategorySchema,
				input: "phasedTurns",
				outputKey: "professionalismScore"
			},
			callManagementScore: {
				schema: scoreCategorySchema,
				input: "phasedTurns",
				outputKey: "callManagementScore"
			},
			accuracyScore: {
				schema: scoreCategorySchema,
				input: "phasedTurns",
				outputKey: "accuracyScore"
			},
			callerExperienceScore: {
				schema: scoreCategorySchema,
				input: "phasedTurns",
				outputKey: "callerExperienceScore"
			},
			turnAnnotation: {
				schema: turnAnnotatorSchema,
				input: "phasedTurns",
				outputKey: "annotatedTurns"
			},
			final: {
				schema: CallAnalysisSchema,
				input: ["annotatedTurns", "professionalismScore", "callManagementScore", "accuracyScore", "callerExperienceScore"],
				outputKey: "result"
			}
		}

export function createNode (systemPrompt: string, node: number) {

	return async (state: any) => {
		let modelWithStructuredOutput;
		let selectedNode;
		// let stateObjects = ["transcript", ]s
		switch (node) {
			case 1:
				selectedNode = nodeConfigs.phaseClassifier
				break;
			case 2:
				selectedNode = nodeConfigs.professionalismScore
				break
			case 3:
				selectedNode = nodeConfigs.callManagementScore
				break
			case 4:
				selectedNode = nodeConfigs.accuracyScore
				break
			case 5:
				selectedNode = nodeConfigs.callerExperienceScore
				break
			case 6:
				selectedNode = nodeConfigs.turnAnnotation
				break
			case 7:
				selectedNode = nodeConfigs.final
				break
			default:
				throw new Error("LLM Schema misconfigured")
		}
		modelWithStructuredOutput = model.withStructuredOutput(selectedNode.schema)
		
		let inputData;
		if(Array.isArray(selectedNode.input)) {
			inputData = selectedNode.input.reduce((obj, key) => {
						obj[key] = state[key];
						return obj;
					}, {} as any)
		}
		

		const response = await modelWithStructuredOutput.invoke([
			new SystemMessage(systemPrompt),
			new HumanMessage(JSON.stringify(inputData ?? state[selectedNode.input as string])),
		])
		return { [selectedNode.outputKey]: response };
	}
}