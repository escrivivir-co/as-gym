#!/usr/bin/env node
import { AlephMcpClient } from "./client/mcp-client.js";
import * as readline from 'readline';

// Create readline interface for interactive use
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Server connection settings
const DEFAULT_SERVER_URL = "ws://localhost:8080";

// Create a client instance
let client: AlephMcpClient;
let tools: string[] = [];

// Helper to ask questions
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Connect to the MCP server
async function connectToServer() {
  try {
    const serverUrl = await question(`Enter MCP server URL [${DEFAULT_SERVER_URL}]: `);
    const finalUrl = serverUrl || DEFAULT_SERVER_URL;
    
    client = new AlephMcpClient(finalUrl);
    
    console.log(`Connecting to ${finalUrl}...`);
    await client.connect();
    
    tools = await client.refreshAvailableTools();
    console.log(`Connected! Available tools: ${tools.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error("Failed to connect:", error);
    return false;
  }
}

// Call a tool with parameters
async function callTool() {
  if (tools.length === 0) {
    console.log("No tools available. Try refreshing the tools list.");
    return;
  }
  
  // Show tool options
  console.log("\nAvailable tools:");
  tools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool}`);
  });
  
  // Get tool selection
  const selection = await question("\nSelect a tool (number): ");
  const index = parseInt(selection, 10) - 1;
  
  if (isNaN(index) || index < 0 || index >= tools.length) {
    console.log("Invalid selection");
    return;
  }
  
  const selectedTool = tools[index];
  console.log(`\nSelected tool: ${selectedTool}`);
  
  // Get parameters
  const paramsStr = await question("Enter parameters as JSON (or leave empty): ");
  
  let params = {};
  if (paramsStr.trim()) {
    try {
      params = JSON.parse(paramsStr);
    } catch (error) {
      console.error("Invalid JSON parameters");
      return;
    }
  }
  
  // Call the tool
  try {
    console.log("\nCalling tool...");
    const result = await client.callTool(selectedTool, params);
    console.log("\nResult:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error calling tool:", error);
  }
}

// Main function
async function main() {
  console.log("=== Aleph MCP Client CLI ===");
  
  // Connect to the server
  if (!await connectToServer()) {
    rl.close();
    return;
  }
  
  // Main menu loop
  while (true) {
    console.log("\n=== Menu ===");
    console.log("1. Refresh available tools");
    console.log("2. Call a tool");
    console.log("3. Disconnect and exit");
    
    const choice = await question("\nSelect an option: ");
    
    switch (choice) {
      case "1":
        tools = await client.refreshAvailableTools();
        console.log(`Available tools: ${tools.join(', ')}`);
        break;
        
      case "2":
        await callTool();
        break;
        
      case "3":
        await client.disconnect();
        console.log("Disconnected. Goodbye!");
        rl.close();
        return;
        
      default:
        console.log("Invalid choice");
    }
  }
}

// Run the CLI
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});