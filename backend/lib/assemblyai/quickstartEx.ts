// Start by making sure the `assemblyai` and `node-record-lpcm16` packages are installed.
// If not, you can install it by running the following command:
// npm install assemblyai node-record-lpcm16

import { AssemblyAI } from "assemblyai";
import { Readable } from "stream";

const run = async () => {
  const client = new AssemblyAI({
    // Replace with your chosen API key, this is the "default" account api key
    apiKey: process.env.ASSEMBLY_AI_API_KEY!,
  });

  const CONNECTION_PARAMS = {
    sampleRate: 16000,
    speechModel: "u3-rt-pro" as const
  }

  const transcriber = client.streaming.transcriber(CONNECTION_PARAMS);

  transcriber.on("open", ({ id }) => {
    console.log(`Session opened with ID: ${id}`);
  });

  transcriber.on("error", (error) => {
    console.error("Error:", error);
  });

  transcriber.on("close", (code, reason) =>
    console.log("Session closed:", code, reason)
  );

  transcriber.on("turn", (turn) => {
    if (!turn.transcript) {
      return;
    }

    console.log("Turn:", turn.transcript);
  });

  try {
    console.log("Connecting to streaming transcript service");

    await transcriber.connect();


    Readable.toWeb(recording.stream()).pipeTo(transcriber.stream());

  } catch (error) {
    console.error(error);
  }
};

run();