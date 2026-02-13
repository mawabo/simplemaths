
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Serve Frontend Static Files
// The path depends on where the backend is run from. Assuming from 'backend' root:
const frontendPath = path.join(__dirname, '../../frontend/dist/frontend/browser');
app.use(express.static(frontendPath));

// Fallback to index.html for Angular routing
app.get('*', (req, res) => {
    // Check if api request, ignore
    if (req.url.startsWith('/api')) {
        return res.status(404).send('Not Found');
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
