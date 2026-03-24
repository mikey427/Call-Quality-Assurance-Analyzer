import express, { Request, Response } from "express";
import { agent } from "./ai/graph";
import { HumanMessage } from "@langchain/core/messages";
import busboy from "busboy";
import { createWriteStream, WriteStream } from "fs";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.use(express.json());
const port = 3001;

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.post("/analyze", async (req, res) => {
	console.log("hit /analyze");
	const result = await agent.invoke({
		messages: [new HumanMessage(req.body.message)],
	});
	res.json({ messages: result.messages });
});

app.post("/upload", (req, res) => {
	const bb = busboy({
		headers: req.headers,
		limits: { fileSize: 10 * 1024 * 1024 },
	});

	bb.on("file", (name, stream, info) => {
		const saveTo = path.join("uploads", path.basename(info.filename || "upload"));

		if (info.mimeType !== "audio/mpeg" && info.mimeType !== "audio/wav") {
			stream.resume();
			return res.json({ success: false, reason: "Incorrect file type. (MP3, WAV)" });
		}

		const writeStream = createWriteStream(saveTo);

		writeStream.on("error", () => {
			res.status(500).json({ success: false, reason: "Failed to save file" });
		});

		writeStream.on("finish", () => {
			res.json({ success: true });
		});

		stream.pipe(writeStream);
	});

	bb.on("error", () => {
		res.status(500).json({ success: false, reason: "Upload failed" });
	});

	req.pipe(bb);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
