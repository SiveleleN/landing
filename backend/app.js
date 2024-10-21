const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());  // Allow CORS
app.use(express.json());  // Parse JSON requests

let names = ["Alice", "Bob", "Charlie"];  // Example names
let submitters = ["Admin", "User", "Admin2"];  // Example submitters

// GET route to fetch names
app.get('/names', (req, res) => {
    res.json({
        names: names,
        submitters: submitters
    });
});

// POST route to add a new name
app.post('/names', (req, res) => {
    const { name, submitter } = req.body;
    
    if (!name || !submitter) {
        return res.status(400).json({ error: 'Name and submitter are required' });
    }

    // Add the new name and submitter
    names.push(name);
    submitters.push(submitter);

    res.status(201).json({ message: 'Name added successfully', names, submitters });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
