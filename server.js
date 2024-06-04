const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (your HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Define the target directory outside of the root directory
const targetDirectory = 'C:/Users/Qub3z Gaming L4/OneDrive/Qub3zGamingL4';

// Route to handle form submission
app.post('/submit-feedback', (req, res) => {
    const { name, feedback } = req.body;

    // Ensure the target directory exists, create it if it doesn't
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true }); // Use { recursive: true } to create parent directories if they don't exist
    }

    // Specify the file name
    const filename = 'feedback.csv';

    // Specify the file path
    const filePath = path.join(targetDirectory, filename);

    // CSV content
    const csvContent = `Name,Feedback\n${name},${feedback}\n`;

    // Write the CSV file
    fs.writeFile(filePath, csvContent, (err) => {
        if (err) {
            console.error('Error writing CSV file:', err);
            res.status(500).json({ success: false, error: 'Server error' });
        } else {
            console.log('Feedback saved to feedback.csv');
            res.status(200).json({ success: true });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
