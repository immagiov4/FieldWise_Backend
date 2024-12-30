import request from "supertest";
import { app } from "../src/index.js";

describe("Conversation API Tests (session-based)", () => {
  test("POST /ai/converse returns 200, reply, and sessionId", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({
        message: "Ciao come stai?",
        language: "Italiano"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");
    expect(response.body).toHaveProperty("sessionId");

    console.log("Reply:", response.body.reply);
  });

  test("Replies remembering context using the same sessionId", async () => {
    // 1) Start a new conversation
    let response = await request(app)
      .post("/ai/converse")
      .send({
        message: "Hi, my name is Giovanni.",
        language: "English"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");
    expect(response.body).toHaveProperty("sessionId");

    console.log("First reply: ", response.body.reply);

    const { sessionId } = response.body;
    expect(sessionId).toBeTruthy();

    // 2) Continue the conversation with the existing sessionId
    response = await request(app)
      .post("/ai/converse")
      .send({
        sessionId,
        message:
          "Reply to me the word 'test-token' followed by a space and the user name previously communicated.",
        language: "English"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");

    // Expect the AI to remember "Giovanni" and include "test-token"
    const replyLower = response.body.reply.toLowerCase();
    expect(replyLower).toContain("test-token");
    expect(replyLower).toContain("giovanni");

    console.log("Second reply: ", response.body.reply);
  });

  test("POST /ai/converse with script returns 200, coherent reply", async () => {
    // 1) Start a new conversation
    let response = await request(app)
      .post("/ai/converse")
      .send({
        message:
            "System test: return me the string 'yes' if you have been instructed about following a script, " +
            "followed by a space and the Name of the script (not the topics!) if you see one. If the language is not English, " +
            "or something is wrong, reply just 'no'",
        language: "English",
        script: "Name: TestScript. Content: 1. First topic, 2. Second topic..."
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");

    // Expect the AI to include "yes" and "testscript"
    const replyLower = response.body.reply.toLowerCase();
    expect(replyLower).toContain("yes");
    expect(replyLower).toContain("testscript");

    console.log("Reply: ", response.body.reply);
  });
  
  test("POST /ai/converse with missing message returns 400", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({});
    
    expect(response.status).toBe(400);
  })

  test("POST /ai/converse with missing language returns 400", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({message: "hi"});
    
    expect(response.status).toBe(400);
  })
});
