// routes/transcribe.js
import { authenticate } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
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
      return res.status(400).json({ error: 'No audio file provided. Use "audio" field.' })
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
          }
        }
      )
      res.json({ transcription: whisperResponse.data.text })
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message)
      res.status(500).json({ error: "Error during audio transcription." })
    }
  })
})

export default router