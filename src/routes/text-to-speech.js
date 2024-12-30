import { authenticate } from "../middleware/auth.js"
import express from "express"
import textToSpeech from '@google-cloud/text-to-speech'

const router = express.Router()

/**
 * POST /ai/text-to-speech
 * Request JSON format:
 * {
 *   "text": string,         // Required: Text to convert to speech
 *   "languageCode": string, // Optional: Language code (default: "en-US")
 *   "name": string,        // Optional: Voice name (default: "en-US-Standard-A")
 * }
 */
router.post("/", authenticate, async (req, res) => {
   const { 
     text, 
     languageCode = "en-US",
     name = "en-US-Standard-A"
   } = req.body

   if (!text?.trim()) {
      return res.status(400).json({ error: 'Missing "text" field' })
   }

   try {
      // Creates a client
      const client = new textToSpeech.TextToSpeechClient({
         keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS,
      })

      const request = {
         input: { text },
         voice: { languageCode, name },
         audioConfig: { audioEncoding: 'MP3' },
      }

      // Performs the text-to-speech request
      const [response] = await client.synthesizeSpeech(request)

      // Set appropriate headers for audio
      res.setHeader('Content-Type', 'audio/mpeg')
      res.send(response.audioContent)

   } catch (error) {
      console.error("Text-to-speech error:", error)
      res.status(500).json({ 
         error: "Error during text-to-speech conversion",
         details: error.message
      })
   }
})

export default router
