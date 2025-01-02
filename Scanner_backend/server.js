const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());  // Enable cross-origin resource sharing
app.use(bodyParser.json());  // Parse JSON data

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder where the file will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to filename
  }
});

const upload = multer({ storage: storage });  // Initialize multer with storage settings

// Route to handle file uploads (POST /upload)
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log('File uploaded:', req.file);  // Log the uploaded file info
    res.status(200).send({ message: 'File uploaded successfully!' });  // Send success response
  } else {
    res.status(400).send({ message: 'No file uploaded.' });  // Send error response if no file uploaded
  }
});

// Add a route for the root path (GET /)
app.get('/', (req, res) => {
  res.send('Welcome to the file upload service!');  // Display a message on the root path
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
