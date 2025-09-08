/**
 * Simple demo thread using compiled packages
 */

// Import from local compiled packages
const { Runtime } = require('./packages/runtime/dist/index.js');
const { CandidateElimination } = require('./packages/machine-learning/dist/index.js');
const { systemMessage } = require('./packages/i18n/dist/index.js');

const http = require('http');

const host = 'localhost';
const port = 8080;

const requestListener = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <html>
        <head><title>FIA Demo Thread</title></head>
        <body>
            <h1>FIA AI Framework Demo</h1>
            <p>Runtime and Machine Learning components are running!</p>
            <p>Check console for output.</p>
        </body>
        </html>
    `);
};

const server = http.createServer(requestListener);

server.on('error', (e) => {
    console.log(systemMessage(`Thread Handle Error: ${e.message}`));
});

server.listen(port, async () => {
    console.log(systemMessage("🚀 Starting FIA Demo Thread..."));
    console.log(systemMessage(`Server running at http://${host}:${port}/`));

    // Test Runtime
    console.log("\n=== Testing Runtime ===");
    const runtime = new Runtime();
    runtime.start();
    await runtime.demo();

    // Test Machine Learning
    console.log("\n=== Testing Machine Learning ===");
    const candidateElimination = new CandidateElimination();
    candidateElimination.test();
    candidateElimination.test2();

    console.log(systemMessage("✅ All components loaded successfully!"));
    console.log(systemMessage(`Visit http://${host}:${port}/ to see the demo page`));
});
