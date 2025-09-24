// Simple HTTP Server for SEFRA CORRETORA Landing Page
// For development and testing purposes

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// API endpoints for lead submission
const apiEndpoints = {
    '/api/leads': {
        method: 'POST',
        handler: (req, res) => {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const leadData = JSON.parse(body);
                    
                    // Log lead data (in production, save to database)
                    console.log('New lead received:', {
                        timestamp: new Date().toISOString(),
                        ...leadData
                    });
                    
                    // Simulate processing time
                    setTimeout(() => {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        });
                        
                        res.end(JSON.stringify({
                            success: true,
                            message: 'Lead received successfully',
                            leadId: 'lead_' + Date.now()
                        }));
                    }, 500);
                    
                } catch (error) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid JSON data'
                    }));
                }
            });
        }
    }
};

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }
    
    // Handle API endpoints
    if (apiEndpoints[pathname]) {
        const endpoint = apiEndpoints[pathname];
        if (endpoint.method === method) {
            endpoint.handler(req, res);
            return;
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
        }
    }
    
    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Página não encontrada</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #C80F15; }
                    </style>
                </head>
                <body>
                    <h1>404 - Página não encontrada</h1>
                    <p>A página que você procura não existe.</p>
                    <a href="/">Voltar para a página inicial</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Get file extension and set content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            // Set headers
            const headers = {
                'Content-Type': contentType,
                'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
            };
            
            // Add security headers
            headers['X-Content-Type-Options'] = 'nosniff';
            headers['X-Frame-Options'] = 'DENY';
            headers['X-XSS-Protection'] = '1; mode=block';
            headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
            
            res.writeHead(200, headers);
            res.end(data);
        });
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 SEFRA CORRETORA Landing Page Server`);
    console.log(`📱 Running on http://localhost:${PORT}`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/leads`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

module.exports = server;