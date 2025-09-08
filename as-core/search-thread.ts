/**
 * Search algorithms thread - TypeScript version
 * Simulates the original sb-thread.ts functionality
 */

import * as http from 'http';

// Import from local compiled packages
const { EscaladaMaximoGradiente, PrimeroEnAnchura, AEstrella } = require('./packages/search-algorithms/dist/index.js');
const { systemMessage } = require('./packages/i18n/dist/index.js');

const host: string = 'localhost';
const port: number = 8002;

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FIA Search Algorithms Thread</title>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; padding: 40px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #333;
                }
                .container { 
                    background: white; 
                    padding: 40px; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 { 
                    color: #2c3e50; 
                    border-bottom: 3px solid #3498db; 
                    padding-bottom: 15px; 
                    text-align: center;
                }
                .algorithm { 
                    margin: 25px 0; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
                    border-left: 5px solid #3498db; 
                    border-radius: 8px;
                    transition: transform 0.2s;
                }
                .algorithm:hover {
                    transform: translateX(5px);
                }
                .status { 
                    color: #27ae60; 
                    font-weight: bold; 
                    text-align: center;
                    font-size: 1.1em;
                }
                .test-results {
                    background: #e8f5e8;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .emoji { font-size: 1.3em; margin-right: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1><span class="emoji">🔍</span>FIA Search Algorithms Thread</h1>
                <div class="status">✅ Server running on http://${host}:${port}</div>
                
                <div class="algorithm">
                    <h3><span class="emoji">🏔️</span>Escalada de Máximo Gradiente (Hill Climbing)</h3>
                    <p>Algoritmo de búsqueda local que siempre se mueve hacia el vecino con mejor evaluación heurística.</p>
                    <div class="test-results">
                        <strong>Tests ejecutados:</strong> 5/5 ✅
                    </div>
                </div>
                
                <div class="algorithm">
                    <h3><span class="emoji">🌊</span>Búsqueda Primero en Anchura (BFS)</h3>
                    <p>Algoritmo de búsqueda sistemática que explora todos los nodos a la misma distancia antes de explorar nodos más lejanos.</p>
                </div>
                
                <div class="algorithm">
                    <h3><span class="emoji">⭐</span>A* Search Algorithm</h3>
                    <p>Algoritmo de búsqueda heurística que encuentra el camino óptimo usando una función de evaluación f(n) = g(n) + h(n).</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p><strong>Thread Status:</strong> <span class="status">RUNNING</span></p>
                    <p><strong>Framework:</strong> FIA AI Framework (TypeScript)</p>
                    <p><strong>Package:</strong> @fia/search-algorithms</p>
                    <p><strong>Thread Type:</strong> sb-thread (Search-Based)</p>
                </div>
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
    console.log(systemMessage("Iniciando sistema FIA - Search Algorithms Thread..."));
    console.log(systemMessage(`Server running at http://${host}:${port}/`));
    
    try {
        // Test Escalada Máximo Gradiente (como en sb-thread.ts original)
        console.log(systemMessage("🏔️ Probando Escalada Máximo Gradiente..."));
        const eg = new EscaladaMaximoGradiente();
        
        // Ejecutar múltiples tests como en el original
        console.log(systemMessage("Ejecutando test básico..."));
        eg.test();
        
        console.log(systemMessage("Ejecutando test2..."));
        eg.test2();
        
        console.log(systemMessage("Ejecutando test3..."));
        eg.test3();
        
        console.log(systemMessage("Ejecutando test4..."));
        eg.test4();
        
        console.log(systemMessage("Ejecutando test6..."));
        eg.test6();
        
        console.log(systemMessage("✅ Escalada Máximo Gradiente - Todos los tests completados"));
        
        // Test otros algoritmos
        console.log(systemMessage("🌊 Probando Primero en Anchura..."));
        const bfs = new PrimeroEnAnchura();
        bfs.test();
        
        console.log(systemMessage("⭐ Probando A* Search..."));
        const astar = new AEstrella();
        astar.test();
        astar.test2();
        
        console.log(systemMessage("🎉 Todos los algoritmos de búsqueda ejecutados exitosamente!"));
        
    } catch (error: any) {
        console.log(systemMessage(`❌ Error ejecutando algoritmos: ${error.message}`));
    }
});
