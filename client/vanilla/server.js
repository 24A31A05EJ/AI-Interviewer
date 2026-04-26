// Simple static file server for vanilla JS version
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route all requests to index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Vanilla JS frontend running on http://localhost:${PORT}`);
    console.log('Make sure backend is running on http://localhost:4000');
});
