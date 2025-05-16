import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPromptTools } from "./tools/prompt-tools.js";
import { registerCodeTools } from "./tools/code-tools.js";
import { registerDocumentationTools } from "./tools/documentation-tools.js";
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del servidor desde variables de entorno
const SERVER_NAME = process.env.MCP_SERVER_NAME || "AlephCodeAgent";
const SERVER_VERSION = process.env.MCP_SERVER_VERSION || "1.0.0";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

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
    
    // Crear e iniciar transporte STDIO
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info("MCP Server started successfully with stdio transport");
  } catch (error) {
    logger.error("Failed to start MCP server:", error);
    throw error;
  }
}

// Manejar señales para una salida limpia
process.on('SIGINT', () => {
  logger.info("Shutting down server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info("Shutting down server...");
  process.exit(0);
});

// Iniciar el servidor
startServer().catch(error => {
  logger.error("Fatal error:", error);
  process.exit(1);
});