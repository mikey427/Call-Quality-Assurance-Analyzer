import { z } from "zod/v4";

const confidenceSchema = z.object({
	score: z.number(),
	concerns: z.array(z.string()),
});

export const scoreCategorySchema = z.object({
	score: z.number(),
	reasoning: z.string(),
	confidence: confidenceSchema,
});

export const phaseClassifierSchema = z.object({
    turns: z.array(z.object({
        timestamp: z.string(),
        speaker: z.enum(["agent", "caller"]),
        text: z.string(),
        phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
    }))
});

// export const turnAnnotatorSchema = z.array(z.object({
// 	timestamp: z.string(),
// 	speaker: z.enum(["agent", "caller"]),
// 	text: z.string(),
// 	phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
// 	flags: z.array(z.string()),
// 	note: z.string().nullable(),
// })).default([]);

export const turnAnnotatorSchema = z.object({
	turns: z.array(z.object({
	timestamp: z.string(),
	speaker: z.enum(["agent", "caller"]),
	text: z.string(),
	phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
	flags: z.array(z.string()),
	note: z.string().nullable(),
}))
})

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
	turns: z.array(z.object({
		timestamp: z.string(),
		speaker: z.enum(["agent", "caller"]),
		text: z.string(),
		phase: z.enum(["pickup", "call_management", "message_taking", "closing"]),
		flags: z.array(z.string()),
		note: z.string(),
	})),
});