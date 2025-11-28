const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8001;

const server = http.createServer((req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Static file serving
    const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json'
    };

    const ext = req.url.split('.').pop().toLowerCase();
    const fileType = contentType[ext] || 'text/plain';
    const filePath = req.url === '/' ? 'visualization/index.html' : `visualization/${req.url}`;

    console.log(`Serving ${filePath} (${ext})`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`Error serving ${filePath}:`, err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`File not found: ${filePath}`);
            return;
        }

        res.writeHead(200, { 'Content-Type': fileType });
        res.end(data);
    });
});

console.log(`🌐 Language Compatibility Matrix Server running on http://localhost:${port}`);
console.log('📊 Open your browser and navigate to: http://localhost:8001');