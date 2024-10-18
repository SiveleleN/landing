const express = require('express');
const app = express();
app.use(express.json()); // For parsing POST request bodies

// Temporary storage (replace with a database later)
let names = [];
let submitters = [];

// Route to handle name submission (POST)
app.post('/submit', (req, res) => {
    const { submitter, name } = req.body;

    if (names.includes(name)) {
        return res.json({ success: false, message: 'Name already exists' });
    }

    names.push(name);
    submitters.push(submitter);

    res.json({ success: true });
});

// Route to get all names (GET)
app.get('/names', (req, res) => {
    res.json({ names, submitters });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
