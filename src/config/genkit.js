import { genkit } from 'genkit';
import { openAI, gpt4o } from 'genkitx-openai';

// Create a Genkit instance with the OpenAI plugin and GPT-4 model
const ai = genkit({
  plugins: [openAI({
    apiKey: process.env.OPENAI_API_KEY
  })],
  model: gpt4o
});

export { ai, gpt4o };