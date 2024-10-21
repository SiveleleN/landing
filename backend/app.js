const express = require('express');
const cors = require('cors');  // Add CORS middleware

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); // For parsing POST request bodies

// Temporary storage (replace with a database later)
let names = [];
let submitters = [];

// POST route for name submission
app.post('/submit', (req, res) => {
    const { submitter, name } = req.body;

    // Check if both fields are provided
    if (!submitter || !name) {
        return res.status(400).json({
            success: false,
            message: "Submitter and Name are required."
        });
    }

    // Check if the name already exists
    if (names.includes(name)) {
        return res.json({
            success: false,
            message: "Name already exists!"
        });
    }

    // If name is new, add it
    names.push(name);
    submitters.push(submitter);

    // Respond with success message
    return res.json({
        success: true,
        message: "Name submitted successfully."
    });
});

// Route to get all names (GET)
app.get('/names', (req, res) => {
    res.json({ names, submitters });
});

// Handle non-existent favicon to avoid 404
app.get('/favicon.ico', (req, res) => {
    res.status(204);
});

// Start the server
const PORT = process.env.PORT
