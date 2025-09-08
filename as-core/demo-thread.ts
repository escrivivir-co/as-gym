/**
 * Simple demo thread using compiled packages - TypeScript version
 */

import * as http from 'http';

// Import from local compiled packages
const { Runtime } = require('./packages/runtime/dist/index.js');
const { CandidateElimination } = require('./packages/machine-learning/dist/index.js');
const { systemMessage } = require('./packages/i18n/dist/index.js');

const host: string = 'localhost';
const port: number = 8080;

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FIA Demo Thread</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f8f9fa; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; margin-bottom: 20px; }
                .status { color: #27ae60; font-weight: bold; margin: 15px 0; }
                .demo-section { margin: 20px 0; padding: 20px; background: #ecf0f1; border-radius: 5px; }
                .emoji { font-size: 1.2em; margin-right: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1><span class="emoji">🚀</span>FIA Framework Demo Thread</h1>
                <div class="status">✅ Server running on http://${host}:${port}</div>
                
                <div class="demo-section">
                    <h3><span class="emoji">⚙️</span>Runtime Engine</h3>
                    <p>El motor de runtime FIA está ejecutándose correctamente.</p>
                </div>
                
                <div class="demo-section">
                    <h3><span class="emoji">🤖</span>Machine Learning</h3>
                    <p>Algoritmo Candidate Elimination ejecutado exitosamente.</p>
                </div>
                
                <div class="demo-section">
                    <h3><span class="emoji">🌍</span>Sistema de Mundos</h3>
                    <p>Dominio de datos y estructuras de mundo inicializadas.</p>
                </div>
                
                <p><strong>Framework:</strong> FIA AI Framework (TypeScript)</p>
                <p><strong>Thread:</strong> Demo Thread</p>
                <p><strong>Status:</strong> <span class="status">RUNNING</span></p>
            </div>
        </body>
        </html>
    `);
};

const server: http.Server = http.createServer(requestListener);

server.on('error', (e: Error): void => {
    console.log(systemMessage(`Thread Handle Error: ${e.message}`));
});

server.listen(port, async (): Promise<void> => {
    console.log(systemMessage("Iniciando sistema FIA - Demo Thread..."));
    console.log(systemMessage(`Server running at http://${host}:${port}/`));
    
    try {
        // Test Runtime
        console.log(systemMessage("🚀 Iniciando Runtime..."));
        const rt = new Runtime();
        rt.start();
        await rt.demo();
        
        // Test Machine Learning
        console.log(systemMessage("🤖 Probando Machine Learning..."));
        const ml = new CandidateElimination();
        ml.test();
        ml.test2();
        
        console.log(systemMessage("✅ Demo completado exitosamente!"));
        
    } catch (error: any) {
        console.log(systemMessage(`❌ Error en demo: ${error.message}`));
    }
});
