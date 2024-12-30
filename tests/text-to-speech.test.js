import request from 'supertest';
import { app } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Text-to-speech API Tests', () => {
   test('successful text-to-speech conversion', async () => {
      const response = await request(app)
         .post('/ai/text-to-speech')
         .set('Authorization', `Bearer ${process.env.GOOGLE_API_KEY}`)
         .send({
            text: 'Hello, testing Google Text-to-Speech.',
            languageCode: 'en-US',
            name: 'en-US-Standard-A'
         });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('audio/mpeg');
   }, 10000);

   test('missing text parameter returns 400', async () => {
      const response = await request(app)
         .post('/ai/text-to-speech')
         .set('Authorization', `Bearer ${process.env.GOOGLE_API_KEY}`)
         .send({
            languageCode: 'en-US',
            name: 'en-US-Standard-A'
         });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing "text" field');
   });

   test('invalid voice name returns 500', async () => {
      const response = await request(app)
         .post('/ai/text-to-speech')
         .set('Authorization', `Bearer ${process.env.GOOGLE_API_KEY}`)
         .send({
            text: 'Hello',
            languageCode: 'en-US',
            name: 'invalid-voice'
         });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error during text-to-speech conversion');
   });
});