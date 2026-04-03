import express, { Request, Response } from "express";
import cors from "cors";
import { agent } from "./lib/ai/graph.js";
import { HumanMessage } from "@langchain/core/messages";
import busboy from "busboy";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { getPresignedUrl, uploadFile } from "./lib/cloudflare/client.js";
import { createNewAnalysis } from "./lib/db/db.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
const port = 3001;

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

// app.post("/api/analyze", async (req, res) => {
// 	console.log("hit /analyze");
// 	const result = await agent.invoke({
// 		messages: [new HumanMessage(req.body.message)],
// 	});
// 	res.json({ messages: result.messages });
// });

app.post("/api/analyze", async (req, res) => {
	const session = await auth.api.getSession({
		headers: req.headers as HeadersInit,
	});
	if (!session) return res.status(401).json({ message: "Unauthorized" });

	const userId = session.user.id;

	const bb = busboy({
		headers: req.headers,
		limits: { fileSize: 10 * 1024 * 1024 },
	});

	bb.on("file", async (name, stream, info) => {
		// const saveTo = path.join("uploads", path.basename(info.filename || "upload"));

		if (info.mimeType !== "audio/mpeg" && info.mimeType !== "audio/wav") {
			stream.resume();
			return res.json({
				success: false,
				reason: "Incorrect file type. (MP3, WAV)",
			});
		}

		try {
			const fileName = await uploadFile(stream, name);

			if (!fileName) {
				res.status(500).json("Error uploading file to CloudFlare");
				return
			}

			// const presignedUrl = await getPresignedUrl(fileName);

			const newCallRecord = await createNewAnalysis(userId, fileName);

			if(!newCallRecord) {
				res.status(500).json("Error creating database record");
				return
			}
			
			res.status(201).json({id: newCallRecord.id})
		} catch (error) {
			res.status(500).json({ message: "File upload failed" });
		}
	});

	bb.on("error", () => {
		res.status(500).json({ success: false, reason: "Upload failed" });
	});

	req.pipe(bb);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
