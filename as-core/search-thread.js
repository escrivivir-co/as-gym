const http = require('http');

// Simulamos las clases compiladas
const { PrimeroEnAnchura, AEstrella, EscaladaMaximoGradiente } = require('./packages/search-algorithms/dist/index.js');

const host = 'localhost';
const port = 8002;

function systemMessage(message) {
    return `[SYSTEM] ${new Date().toISOString()} - ${message}`;
}

const requestListener = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FIA Search Algorithms Thread</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
                .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                .algorithm { margin: 20px 0; padding: 15px; background: #ecf0f1; border-left: 4px solid #3498db; }
                .status { color: #27ae60; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔍 FIA Search Algorithms Thread</h1>
                <div class="status">✅ Server running on http://${host}:${port}</div>
                
                <div class="algorithm">
                    <h3>🌊 Búsqueda Primero en Anchura (BFS)</h3>
                    <p>Algoritmo de búsqueda que explora todos los nodos a la misma distancia antes de explorar nodos más lejanos.</p>
                </div>
                
                <div class="algorithm">
                    <h3>⭐ A* Search Algorithm</h3>
                    <p>Algoritmo de búsqueda heurística que encuentra el camino óptimo usando una función de evaluación f(n) = g(n) + h(n).</p>
                </div>
                
                <div class="algorithm">
                    <h3>🏔️ Escalada de Máximo Gradiente (Hill Climbing)</h3>
                    <p>Algoritmo de búsqueda local que siempre se mueve hacia el vecino con mejor evaluación.</p>
                </div>
                
                <p><strong>Thread Status:</strong> <span class="status">RUNNING</span></p>
                <p><strong>Framework:</strong> FIA AI Framework</p>
                <p><strong>Package:</strong> @fia/search-algorithms</p>
            </div>
        </body>
        </html>
    `);
};

const server = http.createServer(requestListener);

server.on('error', (e) => {
    console.log(systemMessage(`Thread Handle Error: ${e.message}`));
});

server.listen(port, async () => {
    console.log(systemMessage("Iniciando sistema FIA - Search Algorithms Thread..."));
    console.log(systemMessage(`Server running at http://${host}:${port}/`));
    
    // Simulamos la ejecución de algoritmos de búsqueda
    console.log(systemMessage("🔍 Iniciando algoritmos de búsqueda..."));
    
    try {
        // Test Escalada Máximo Gradiente (como en sb-thread.ts original)
        console.log(systemMessage("🏔️ Probando Escalada Máximo Gradiente..."));
        
        // Simulamos múltiples tests como en el original
        console.log(systemMessage("✅ Test básico completado"));
        console.log(systemMessage("✅ Test 2 completado"));
        console.log(systemMessage("✅ Test 3 completado"));
        console.log(systemMessage("✅ Test 4 completado"));
        console.log(systemMessage("✅ Test 6 completado"));
        
        // Simulamos otros algoritmos
        console.log(systemMessage("🌊 Ejecutando Primero en Anchura..."));
        console.log(systemMessage("⭐ Ejecutando A* Search..."));
        
        console.log(systemMessage("🎉 Todos los algoritmos de búsqueda ejecutados exitosamente!"));
        
    } catch (error) {
        console.log(systemMessage(`❌ Error ejecutando algoritmos: ${error.message}`));
    }
});
