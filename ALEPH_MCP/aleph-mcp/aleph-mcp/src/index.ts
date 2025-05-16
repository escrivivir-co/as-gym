import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerPromptTools } from "./tools/prompt-tools.js";
import { registerCodeTools } from "./tools/code-tools.js";
import { registerDocumentationTools } from "./tools/documentation-tools.js";
import { registerNovelistTools } from './tools/novelist-tools.js';
import dotenv from 'dotenv';
import { randomUUID } from "crypto";
import { createServer, Server as HttpServer } from "http";
import { IncomingMessage, ServerResponse } from "http";

// Cargar variables de entorno
dotenv.config();

// Configuración del servidor desde variables de entorno
const SERVER_NAME = process.env.MCP_SERVER_NAME || "AlephCodeAgent";
const SERVER_VERSION = process.env.MCP_SERVER_VERSION || "1.0.0";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT || "3000");
const HTTP_HOST = process.env.MCP_HTTP_HOST || "localhost";

// Configurar logger básico
const logger = {
  info: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL !== 'error') console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]): void => {
    if (LOG_LEVEL === 'debug') console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Crear servidor MCP
const server = new McpServer({
  name: SERVER_NAME,
  version: SERVER_VERSION,
  description: "A code-focused MCP server that provides tools for code analysis, documentation, and prompt templates."
});

// Variable global para el servidor HTTP
let httpServer: HttpServer;

/**
 * Inicializa y registra todas las herramientas en el servidor
 */
function registerAllTools(): void {
  logger.info("Registering tools...");
  
  try {
    // Registrar grupos de herramientas
    registerPromptTools(server);
    registerCodeTools(server);
    registerDocumentationTools(server);
    registerNovelistTools(server); // Añadir esta línea para registrar las nuevas herramientas
    
    logger.info("All tools registered successfully");
  } catch (error) {
    logger.error("Failed to register tools:", error);
    throw error;
  }
}

/**
 * Inicia el servidor con el transporte indicado
 */
async function startServer(): Promise<void> {
  try {
    logger.info(`Starting ${SERVER_NAME} v${SERVER_VERSION}...`);
    
    // Registrar todas las herramientas
    registerAllTools();
    
    // Crear servidor HTTP
    httpServer = createServer();
    
    // Crear transporte HTTP
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: false
    });
    
    // Configurar el servidor HTTP para manejar las solicitudes MCP
    httpServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      try {
        await transport.handleRequest(req, res);
      } catch (error) {
        logger.error('Error handling HTTP request:', error);
        if (!res.headersSent) {
          res.writeHead(500).end(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: "Internal server error"
            },
            id: null
          }));
        }
      }
    });
    
    // Iniciar servidor HTTP primero - esto es crucial
    await new Promise<void>((resolve) => {
      httpServer.listen(HTTP_PORT, HTTP_HOST, () => {
        logger.info(`HTTP server listening on http://${HTTP_HOST}:${HTTP_PORT}`);
        resolve();
      });
    });
    
    // Conectar el transporte al servidor MCP
    await server.connect(transport);
    
    logger.info(`MCP Server started successfully with HTTP transport on http://${HTTP_HOST}:${HTTP_PORT}`);
    logger.info('Server is running, press Ctrl+C to stop');
  } catch (error) {
    logger.error("Failed to start MCP server:", error);
    throw error;
  }
}

// Manejar señales para una salida limpia
process.on('SIGINT', () => {
  logger.info("Shutting down server...");
  if (httpServer) {
    httpServer.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGTERM', () => {
  logger.info("Shutting down server...");
  if (httpServer) {
    httpServer.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Iniciar el servidor
startServer().catch(error => {
  logger.error("Fatal error:", error);
  process.exit(1);
});