const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup express app
const app = express();

// Setup multer for file upload (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json()); // This middleware will parse JSON requests

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Helper function to parse file details
const parseFile = (file) => {
  if (!file) return { valid: false, mimeType: '', sizeKb: 0 };
  const sizeKb = (file.size / 1024).toFixed(0); // Convert size to KB
  return {
    valid: true,
    mimeType: file.mimetype,
    sizeKb,
  };
};

// POST Route to process data and file
app.post('/bfhl', upload.single('file'), (req, res) => {
  try {
    const { jsonData } = req.body;

    if (!jsonData) {
      return res.status(400).json({ is_success: false, error: 'jsonData is required' });
    }

    const parsedData = JSON.parse(jsonData);
    const { data } = parsedData;
    console.log("data" , data) ;

    // Validate if data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: 'Invalid input data' });
    }

    // Process the data
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => isNaN(item));
    const lowercaseLetters = alphabets.filter((item) => /^[a-z]$/.test(item));
    const highestLowercase = lowercaseLetters.length
      ? [lowercaseLetters.reduce((max, current) => (current > max ? current : max))]
      : [];
    const primeFound = numbers.some((num) => isPrime(parseInt(num, 10)));

    // File handling
    const fileDetails = parseFile(req.file);
    console.log("file" , fileDetails) ;

    // Respond with processed data
    const response = 
      {
        is_success: true,
        user_id: 'john_doe_17091999',
        email: 'john@xyz.com',
        roll_number: 'ABCD123',
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase,
        is_prime_found: primeFound,
        file_valid: fileDetails.valid,
        file_mime_type: fileDetails.mimeType,
        file_size_kb: fileDetails.sizeKb,
      }

    console.log("response",response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ is_success: false, error: 'Internal Server Error' });
  }
});

// GET Route
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));