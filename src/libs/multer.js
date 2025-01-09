import multer from 'multer';
import path from 'path';

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a unique timestamp to the filename
  },
});

// Create Multer instance
const upload = multer({ storage });

export default upload;