import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register code analysis and manipulation tools to the MCP server
 */
export function registerCodeTools(server: McpServer) {  // Analyze code
  server.tool(
    "alephAlpha_analyzeCode",
    "Analyzes code snippets to provide insights about structure, complexity and potential issues",
    {
      code: z.string().describe("Code to analyze"),
      language: z.string().describe("Programming language")
    },
    async ({ code, language }: { code: string, language: string }) => {
      // Here we could integrate with a code analyzer or linter
      const analysis = `Analysis for ${language} code:\n` +
                      `- Length: ${code.length} characters\n` +
                      `- Number of lines: ${code.split('\n').length}\n` +
                      `- Number of functions: ${countFunctions(code, language)}\n`;
      
      return {
        content: [{ type: "text", text: analysis }],
        description: "Analyzes code snippets to provide insights about structure, complexity and potential issues"
      };
    }
  );  
  
  // Find code examples
  server.tool(
    "alephAlpha_findCodeExamples",
    "Searches for and returns code examples on a specific topic in the specified programming language",
    {
      topic: z.string().describe("Topic or function to find examples for"),
      language: z.string().describe("Programming language")
    },
    async ({ topic, language }: { topic: string, language: string }) => {
      // Simulation - in a real case you would connect to a knowledge base
      const examples = getCodeExamples(topic, language);
      
      return {
        content: [{ 
          type: "text", 
          text: examples || "No examples found for this topic and language combination." 
        }],
        description: "Searches for and returns code examples on a specific topic in the specified programming language"
      };
    }
  );
}

/**
 * Simple function to count potential functions in code (very basic implementation)
 */
function countFunctions(code: string, language: string): number {
  // This is a very simplified implementation
  switch(language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
      return (code.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{/g) || []).length;
    case 'python':
      return (code.match(/def\s+\w+\s*\(/g) || []).length;
    default:
      return 0;
  }
}

/**
 * Get code examples for a topic and language
 */
function getCodeExamples(topic: string, language: string): string {
  // Sample examples - in a real implementation this would be a database or API call
  const examples: Record<string, Record<string, string>> = {
    "typescript": {
      "mcp": `
// Example of MCP server in TypeScript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
const server = new McpServer({ name: "Example", version: "1.0.0" });
server.tool("hello", {}, async () => ({ content: [{ type: "text", text: "Hello world!" }] }));
      `,
      "async": `
// Example of async/await in TypeScript
async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(\`https://api.example.com/users/\${userId}\`);
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.status}\`);
  }
  
  return response.json();
}
      `
    },
    "python": {
      "async": `
# Example of async in Python
import asyncio

async def fetch_data(url):
    print(f"Fetching {url}")
    await asyncio.sleep(1)  # Simulate network delay
    return f"Data from {url}"

async def main():
    results = await asyncio.gather(
        fetch_data("example.com/1"),
        fetch_data("example.com/2")
    )
    print(results)

asyncio.run(main())
      `
    }
  };
  
  return examples[language]?.[topic] || "";
}