import { AlephMcpClient } from "./mcp-client.js";

/**
 * Example script demonstrating how to use the AlephMcpClient
 */
async function main() {
  // Create a new client instance (replace with your actual server URL)
  const client = new AlephMcpClient("ws://localhost:8080");
  
  try {
    // Connect to the server
    await client.connect();
    
    // Get available tools
    const tools = await client.refreshAvailableTools();
    console.log("Available tools:", tools);
    
    // Example: Get a prompt template
    const template = await client.getPromptTemplate("code-review");
    console.log("Code review template:", template);
    
    // Example: Apply variables to a template
    const filledTemplate = await client.applyPromptTemplate("code-review", {
      code: "function sum(a, b) {\n  return a + b;\n}"
    });
    console.log("Applied template:", filledTemplate);
    
    // Example: Analyze code
    const analysis = await client.analyzeCode(
      "function greet(name) {\n  return `Hello, ${name}!`;\n}",
      "javascript"
    );
    console.log("Code analysis:", analysis);
    
    // Example: Search documentation
    const docResults = await client.searchDocumentation("typescript", 3);
    console.log("Documentation search results:", docResults);
    
  } catch (error) {
    console.error("Error in example client:", error);
  } finally {
    // Always disconnect when done
    await client.disconnect();
  }
}

// Run the example
main().catch(console.error);