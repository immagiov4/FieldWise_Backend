import request from 'supertest';
import { app } from '../src/index.js';
import fs from 'fs';

describe('Audio Transcription API Tests', () => {
  const audioFile = './tests/fixtures/test-audio.mp3';
  
  beforeAll(() => {
    // Ensure test audio file exists
    if (!fs.existsSync(audioFile)) {
      throw new Error('Test audio file missing - add test-audio.mp3 in tests/fixtures/');
    }
  });

  test('valid audio file transcription', async () => {
    const response = await request(app)
      .post('/ai/transcribe')
      .attach('audio', audioFile)
      .timeout(70000); // Increased timeout for tests
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('transcription');
    
    console.log("Transcription: " + response.body.transcription);
  }, 15000);  // Shorter timeout, but still enough for the request

  test('missing audio file error', async () => {
    const response = await request(app)
      .post('/ai/transcribe');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No audio file provided. Use "audio" field.');
  });

  test('invalid audio file error', async () => {
    const response = await request(app)
      .post('/ai/transcribe')
      .attach('audio', Buffer.from('invalid'), 'test.txt');  // Invalid extension
    
    expect(response.status).toBe(400);
    // should exist an error field
    expect(response.body).toHaveProperty('error');
  });
});