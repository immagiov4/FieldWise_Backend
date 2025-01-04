# FieldWise AI Backend

## Overview
Backend server leveraging Genkit for AI-driven conversation and transcription services, powered by OpenAI's GPT-4 for conversation, Whisper for audio transcription, and Google Cloud Text-to-Speech (TTS) for speech synthesis. Built with Express.js, it provides routes for AI conversations, audio transcription, and TTS conversion.

## Features
- **AI Conversations**  
   - Context-aware, human-like responses using GPT-4o  
   - Multiple language support  
   - Customizable conversation scripts  

- **Audio Transcription**  
   - High accuracy with OpenAI's Whisper  
   - Handles various audio formats (MP3, WAV, FLAC)  

- **Text-to-Speech**  
   - Converts text to natural-sounding speech with Google Cloud TTS  
   - Supports multiple languages and voices  

- **Authentication**  
   - Firebase authentication ensures secure endpoints  
   - Easy integration for user management  

## Installation
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables by creating a `.env` file:
    ```env
    OPENAI_API_KEY=your_OPENAI_API_KEY
    GOOGLE_API_KEY=your_google_api_key
    GOOGLE_CLOUD_CREDENTIALS=./secret_keys/google_cloud_key.json
    FIREBASE_SERVICE_ACCOUNT_KEY=./secret_keys/firebase_key.json
    PORT=4000
    BYPASS_AUTH=true
    ```
4. Add your Firebase service account key to `./secret_keys/firebase_key.json`.
5. Add your Google Cloud service account key to `./secret_keys/google_cloud_key.json`.

## Usage

### Start the Server
```bash
npm start
```

### API Endpoints

#### Health Check
- **GET /**:  
   Simple health check route.
   ```bash
   curl http://localhost:4000/
   ```

#### AI Conversation
- **POST /ai/converse**: Starts or continues a conversation.
   - Request Body:
      ```json
      {
         "language": "string",     // ISO 639-1 language code (e.g., "en", "es")
         "script": "string",       // Required. Defines conversation context and rules
         "history": [              // Mandatory. Array of messages
            {
               "role": "user" | "assistant",
               "content": "string"
            }
         ]
      }
      ```
      - **language**: Determines the language for AI responses  
      - **script**: Required. Contains conversation rules, context, and flow logic.
      Example of script:
      ```txt
      Name: Relation Databases
      Topics:
      1. What are relational databases?
      2. How do they work?
      3. What are the benefits of using them?
      ...etc
      ```
      - **history**: Conversation history.
   - Response Body:
      ```json
      {
         "reply": "string",              // AI's response message. Can contain special tokens.
         "feedback": "string",           // Negative-only feedback on user's input
         "correctnessPercent": number    // Accuracy score of user's input (0-100%)
      }
      ```
      - **reply**: it can contain special tokens starting with `@`. They are:
         - **@END_CONVERSATION**: indicates that the conversation finished
      - **feedback**: a feedback about the prompt, only containing constructive negative criticism, or otherwise equals to `@NO_FEEDBACK`.
#### Audio Transcription
- **POST /ai/transcribe**: Transcribes an audio file.
   - Request: `multipart/form-data` with an `audio` field
      ```json
      {
         "audio": "file"    // Supported formats: 'mp3', 'mp4', 'mpeg', 'mpga', 'wav', 'webm' (max 25MB)
      }
      ```
   - Response Body:
      ```json
      {
         "transcript": "string"    // Transcribed text from the audio file
      }
      ```

#### Text-to-Speech
- **POST /ai/text-to-speech**: Converts text to speech.
   - Request Body:
      ```json
      {
         "text": "string",         // Text to convert to speech
         "languageCode": "string", // BCP-47 language code (e.g., "en-US")
         "name": "string"          // Voice name (e.g., "en-US-Standard-A")
      }
      ```
   - Response: Returns audio file in `audio/mpeg` format

## Testing
Run tests using Jest:
```bash
npm test
```