import request from "supertest";
import { app } from "../src/index.js";

describe("Conversation API Tests (history-based)", () => {
  test("POST /ai/converse returns 200, reply, feedback, and correctnessPercent", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({
        history: [{ role: "user", content: "Ciao come stai?" }],
        language: "Italiano"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");
    expect(response.body).toHaveProperty("feedback");
    expect(response.body).toHaveProperty("correctnessPercent");

    console.log("Reply:", response.body.reply);
  });

  test("Replies remembering context using history", async () => {
    // 1) First message
    let firstResponse = await request(app)
      .post("/ai/converse")
      .send({
        history: [{ role: "user", content: "Hi, my name is Giovanni." }],
        language: "English"
      });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty("reply");

    // 2) Continue the conversation with history
    const history = [
      { role: "user", content: "Hi, my name is Giovanni." },
      { role: "assistant", content: firstResponse.body.reply },
      { role: "user", content: "Reply to me the word 'test-token' followed by a space and the user name previously communicated." }
    ];

    const secondResponse = await request(app)
      .post("/ai/converse")
      .send({
        history: history,
        language: "English"
      });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toHaveProperty("reply");
    expect(secondResponse.body).toHaveProperty("feedback");
    expect(secondResponse.body).toHaveProperty("correctnessPercent");

    const replyLower = secondResponse.body.reply.toLowerCase();
    expect(replyLower).toContain("test-token");
    expect(replyLower).toContain("giovanni");

    console.log("Second reply: ", secondResponse.body.reply);
  });

  test("POST /ai/converse with script returns 200, coherent reply", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({
        history: [{ 
          role: "user", 
          content: "System test: return me the string 'yes' if you have been instructed about following a script, " +
                   "followed by a space and the Name of the script (not the topics!) if you see one. If the language is not English, " +
                   "or something is wrong, reply just 'no'"
        }],
        language: "English",
        script: "Name: TestScript. Content: 1. First topic, 2. Second topic..."
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply");
    expect(response.body).toHaveProperty("feedback");
    expect(response.body).toHaveProperty("correctnessPercent");

    const replyLower = response.body.reply.toLowerCase();
    expect(replyLower).toContain("yes");
    expect(replyLower).toContain("testscript");

    console.log("Reply: ", response.body.reply);
  });

  test("POST /ai/converse with missing history returns 400", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({});

    expect(response.status).toBe(400);
  });

  test("POST /ai/converse with missing language returns 400", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({ 
        history: [{ role: "user", content: "hi" }]
      });

    expect(response.status).toBe(400);
  });

  test("Correctness and feedback for grammatically incorrect message", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({
        history: [{ role: "user", content: "Me want pizza" }],
        language: "English",
        script: "Name: restaurant. Content: learning how to order food in a restaurant."
      });

    expect(response.status).toBe(200);
    expect(response.body.correctnessPercent).toBeLessThan(100);
    expect(response.body.correctnessPercent).toBeGreaterThanOrEqual(0);
    expect(response.body.feedback).toBeTruthy();
    expect(response.body.feedback.length).toBeGreaterThan(0);
  });

  test("Perfect score and no feedback for correct message", async () => {
    const response = await request(app)
      .post("/ai/converse")
      .send({
        history: [{ role: "user", content: "I would like to have a pizza, please." }],
        language: "English",
        script: "Name: restaurant. Content: learning how to order food in a restaurant."
      });

    expect(response.status).toBe(200);
    expect(response.body.correctnessPercent).toBe(100);
    expect(response.body.feedback).toBe("");
  });
});
