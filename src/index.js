// We use `ai.chat()` to create a conversation session
// and `chat.send()` to send messages and get responses. This allows maintaining an internal
// conversation context.
//
// Assurances and notes:
// - The client continues to maintain history on the client side: with each POST request, the client sends both the current
//   user message and the entire "history" (past conversation). The server rebuilds the context.
// - This example assumes that the "history" has the form:
//   [
//     { "role": "user", "content": "previous user message" },
//     { "role": "assistant", "content": "previous assistant response" },
//     ...
//   ]
// - To rebuild the context, the server replays the user messages from history by calling `chat.send()` for each.
//   This will make the model regenerate the assistant's responses. They might differ from those in history if
//   persistence methods or deterministic seeds aren't used. However, this provides the model with
//   a coherent history. The user will need to handle these aspects at the client level or integrate a SessionStore.
// - The approach shown is simplified: if you want to maintain exactly the original conversation (including
//   assistant responses), you need additional tools (e.g., `SessionStore`), not shown in detail here.
//
// Besides this, we also maintain the audio transcription endpoint shown previously,
// now the "converse" part simply uses Genkit's chat logic.
//

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import converseRouter from "./routes/converse.js";
import transcribeRouter from "./routes/transcribe.js";
import textToSpeechRouter from "./routes/text-to-speech.js";

/*
* SERVER SETUP
*/

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use Helmet to secure Express headers
app.use(helmet());

// Enable CORS for all routes
app.use(cors());

/*
* ROUTES
*/

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: "Internal server error: " + err.message,
    requestId: req.id 
  })
})

app.get("/", (_, res) => {
  res.send("Hello! This server leverages AI to give our app useful features.");
});
app.use("/ai/converse", converseRouter);
app.use("/ai/transcribe", transcribeRouter);
app.use("/ai/text-to-speech", textToSpeechRouter);

/*
* SERVER ENVIROMENT MANAGING
*/

// Start the server in non-test environments
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received; closing server...");
    server.close(() => {
      console.log("Server closed.");
    });
  });
}

// Export the app for testing
export { app };