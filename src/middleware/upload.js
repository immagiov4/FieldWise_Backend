import multer from 'multer';

const VALID_AUDIO_FORMATS = ['mp3', 'mp4', 'mpeg', 'mpga', 'wav', 'webm'];

// Multer is a middleware for handling multipart/form-data when uploading files
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to avoid file system operations
  limits: { fileSize: 25 * 1024 * 1024 }, // 25mb
  fileFilter: (req, file, cb) => {
    const isValid = VALID_AUDIO_FORMATS.includes(
      file.originalname.split('.').pop().toLowerCase()
    );
    cb(null, isValid);
  }
});

export { multer, upload };