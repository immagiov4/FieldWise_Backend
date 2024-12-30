# FieldWise AI Backend

## Overview
Backend server that leverages Genkit for AI-driven conversation and transcription services. It uses OpenAI's GPT-4 model for conversation, Whisper model for audio transcription, and Google Cloud Text-to-Speech (TTS) API for converting text to speech. The server is built using Express.js and includes various routes for handling AI conversations, audio transcription, and text-to-speech conversion.

## Features
- **AI Conversations**: 
   - Maintain conversation context and generate human-like responses using OpenAI's GPT-4 model.
   - Support for multiple languages to cater to a diverse user base.
   - Customizable conversation scripts to tailor interactions based on specific needs.
- **Audio Transcription**: 
   - Transcribe audio files with high accuracy using OpenAI's Whisper model.
   - Support for various audio formats including MP3, WAV, and FLAC.
- **Text-to-Speech**: 
   - Convert text to natural-sounding speech using Google Cloud Text-to-Speech API.
   - Support for multiple languages and voices to provide a personalized user experience.
- **Authentication**: 
   - Secure endpoints using Firebase authentication to ensure only authorized access.
   - Easy integration with Firebase for user management and security.

## Project Structure
```
.
├── build/
│   └── index.js
├── secret_keys/
│   └── google_cloud_key.json
├── src/
│   ├── config/
│   │   ├── firebase.js
│   │   └── genkit.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── converse.js
│   │   ├── transcribe.js
│   │   └── text-to-speech.js
│   └── index.js
├── tests/
│   ├── converse.test.js
│   ├── transcribe.test.js
│   └── text-to-speech.test.js
├── .env
├── .gitignore
├── .parcelsrc
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CLOUD_CREDENTIALS=./secret_keys/google_cloud_key.json
   FIREBASE_SERVICE_ACCOUNT_KEY=./secret_keys/firebase_key.json
   PORT=4000
   ```
4. Add your Firebase service account key to `./secret_keys/firebase_key.json`.

5. Add your Google Cloud service account key to `./secret_keys/google_cloud_key.json`.

## Usage
### Start the Server
```sh
npm start
```

### API Endpoints
#### Health Check
- **GET /**: Simple health check route.
  ```sh
  curl http://localhost:4000/
  ```

#### AI Conversation
- **POST /ai/converse**: Start or continue a conversation with the AI.
   - Request Body:
      ```json
      {
         "message": "string",    // Required: The user's message to the AI.
         "language": "string",   // Required: The language of the conversation.
         "script": "string",     // Optional: A predefined script to guide the conversation.
         "sessionId": "string"   // Optional: An identifier to maintain conversation context across multiple requests.
      }
      ```
   - Explanation:
      - **script**: This optional field allows you to provide a predefined conversation script. The script can be used to tailor the AI's responses based on specific scenarios or requirements, ensuring that the conversation follows a desired flow.
      A script would be structured like this:
      ```
      Theme: Relational Databases
      Topics:
      - Introduction to Relational Databases: Definition, key features (tables, rows, columns), examples (e.g., MySQL).  
      - Basic Terminology: Table, row, column, primary key, foreign key.  
      - SQL Basics: SELECT, INSERT, UPDATE, DELETE; simple queries.  
      - Normalization: Reducing redundancy, 1NF, 2NF, 3NF.  
      - Relationships: One-to-one, one-to-many, joins.  
      - Transactions: ACID properties.  
      ```
      - **sessionId**: This optional field is used to maintain the context of the conversation across multiple interactions. By providing a sessionId, the server can track the conversation history and generate more coherent and contextually relevant responses. If no sessionId is provided, a new session will be created. The session storage is RAM based and will be cleared on server restart, so it's not suitable for long-term storage. This approach has been chosen because because the app doesn't allow for half-finished conversations, and advanced fault tolerance or replication are not a concern for this project.

   TODO: Implement structured output response 
  - Response Body:
    ```json
    {
      "reply": "string",
      "sessionId": "string"
    }
    ```

#### Audio Transcription
- **POST /ai/transcribe**: Transcribe an audio file.
  - Request: `multipart/form-data` with an `audio` field.
  - Response Body:
    ```json
    {
      "transcription": "string"
    }
    ```

#### Text-to-Speech
- **POST /ai/text-to-speech**: Convert text to speech.
  - Request Body:
   ```json
   {
      "text": "string",         // Required: The text that you want to convert to speech.
      "languageCode": "string", // Optional: The language code for the text (e.g., "en-US" for English, "es-ES" for Spanish). If not provided, English language will be used.
      "name": "string"          // Optional: The name of the voice to use for speech synthesis. If not provided, the default voice will be used.
   }
   ```
  - Response: Audio content in `audio/mpeg` format.

## Testing
Run integration tests using Jest:
```sh
npm test
```

## Acknowledgements
- OpenAI for GPT-4 and Whisper models.
- Google Cloud for Text-to-Speech API.
- Firebase for authentication.
