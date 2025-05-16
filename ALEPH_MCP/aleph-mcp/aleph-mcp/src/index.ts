import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPromptTools } from "./tools/prompt-tools";
import { registerCodeTools } from "./tools/code-tools";
import { registerDocumentationTools } from "./tools/documentation-tools";

// Create an MCP server
const server = new McpServer({
  name: "AlephCodeAgent",
  version: "1.0.0",
  description: "A code-focused MCP server that provides tools for code analysis, documentation, and prompt templates."
});

// Register all tool groups
registerPromptTools(server);
registerCodeTools(server);
registerDocumentationTools(server);

// Start the server with stdio transport
const startServer = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP Server started successfully");
};

startServer().catch(error => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});