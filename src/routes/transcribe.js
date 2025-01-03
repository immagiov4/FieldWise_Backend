// routes/transcribe.js
import { authenticate } from "../middleware/auth.js"
import { upload, multer } from "../middleware/upload.js" // Update import to include multer
import axios from "axios"
import FormData from "form-data"
import express from "express"

const router = express.Router()

/**
 * POST /ai/transcribe
 * Request format: multipart/form-data
 * Fields:
 * - audio: File      // Required: Audio file to transcribe
 * 
 * Response JSON format:
 * {
 *   "transcription": string    // The transcribed text
 * }
 * or
 * {
 *   "error": string,          // Error message if request fails
 *   "details"?: string        // Optional detailed error info
 * }
 */
router.post("/", authenticate, (req, res) => {
  upload.single("audio")(req, res, async (err) => {
    if (err) {
      const msg = err instanceof multer.MulterError
        ? `File upload error: ${err.message}`
        : err.message
      return res.status(400).json({ error: msg })
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No audio file provided. Use "audio" field. Received fields: ' + Object.keys(req.body).join(', ')
      });
    }

    try {
      const form = new FormData()
      form.append("file", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      })
      form.append("model", "whisper-1")

      const whisperResponse = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        form,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            ...form.getHeaders()
          },
          timeout: 30000, // 30 second timeout
          validateStatus: status => status < 500 // Don't throw on 4xx errors
        }
      )

      if (whisperResponse.status !== 200) {
        console.error("OpenAI API error:", whisperResponse.data)
        return res.status(502).json({ 
          error: "OpenAI API error",
          details: whisperResponse.data
        })
      }

      res.json({ transcription: whisperResponse.data.text })
    } catch (error) {
      console.error("Transcription error:", {
        message: error.message,
        response: error.response?.data,
        code: error.code
      })

      // Handle specific error cases
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ error: "Request timeout" })
      }
      if (error.response?.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded" })
      }
      
      res.status(500).json({ 
        error: "Error during audio transcription",
        details: error.message
      })
    }
  })
})

export default router