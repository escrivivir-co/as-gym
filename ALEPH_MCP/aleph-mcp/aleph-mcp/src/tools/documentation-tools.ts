import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register documentation tools to the MCP server
 * These tools simulate resources by providing reference documentation
 */
export function registerDocumentationTools(server: McpServer) {  // Tool to get documentation
  server.tool(
    "alephAlpha_getDocumentation",
    "Retrieves comprehensive documentation on a specific programming topic or technology",
    {
      topic: z.string().describe("The documentation topic to retrieve")
    },
    async ({ topic }: { topic: string }) => {
      // Here we would retrieve documentation from some source
      const documentationContent = await fetchDocumentationForTopic(topic);
      
      return {
        content: [
          { 
            type: "text", 
            text: documentationContent 
          }
        ],
        description: "Retrieves comprehensive documentation on a specific programming topic or technology"
      };
    }
  );  
  
  // Tool to search documentation
  server.tool(
    "alephAlpha_searchDocumentation",
    "Performs a search across documentation resources and returns relevant matches",
    {
      query: z.string().describe("Search query"),
      limit: z.number().optional().describe("Maximum number of results to return")
    },
    async ({ query, limit = 5 }: { query: string, limit?: number }) => {
      // Simulated search - in a real case you would search an actual database
      const results = searchDocs(query, limit);
      
      return {
        content: [
          { 
            type: "text", 
            text: JSON.stringify(results, null, 2)
          }
        ],
        description: "Performs a search across documentation resources and returns relevant matches"
      };
    }
  );
}

/**
 * Simulated function to retrieve documentation for a topic
 */
async function fetchDocumentationForTopic(topic: string): Promise<string> {
  // In a real case, you would connect to your database or file system
  const docs: Record<string, string> = {
    "typescript": `# TypeScript Documentation
TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Key Features
- Static typing
- Type inference
- Interfaces
- Generics
- Namespaces
- Decorators

## Basic Types
- boolean
- number
- string
- array
- tuple
- enum
- any
- void
- null and undefined`,

    "mcp": `# Model Context Protocol (MCP)
MCP is an open standard developed by Anthropic that facilitates the connection between language models and external data sources.

## Architecture
- **Hosts**: Applications the user interacts with (like Claude Desktop)
- **Clients**: Components within the host that manage connection to a specific MCP server
- **Servers**: External programs that expose tools, resources, and templates via a standard API

## Capabilities
- **Tools**: Executable functions that the LLM can invoke
- **Resources**: Read-only data sources
- **Prompts**: Predefined templates for workflows`,

    "react": `# React Documentation
React is a JavaScript library for building user interfaces, particularly single-page applications.

## Core Concepts
- Components
- Props
- State
- Lifecycle methods
- Hooks

## Popular Hooks
- useState
- useEffect
- useContext
- useReducer
- useCallback
- useMemo`
  };
  
  // Corrección: Verificar si el topic existe en el objeto docs
  return topic.toLowerCase() in docs ? docs[topic.toLowerCase()] : "Documentation not found for this topic";
}

/**
 * Simulated function to search documentation
 */
function searchDocs(query: string, limit: number): Array<{topic: string, relevance: number, snippet: string}> {
  // Mock data - in a real implementation this would query a search engine or database
  const allDocs = [
    { topic: "typescript", relevance: 0, snippet: "TypeScript is a strongly typed programming language..." },
    { topic: "javascript", relevance: 0, snippet: "JavaScript is a lightweight, interpreted programming language..." },
    { topic: "mcp", relevance: 0, snippet: "MCP is an open standard developed by Anthropic..." },
    { topic: "react", relevance: 0, snippet: "React is a JavaScript library for building user interfaces..." },
    { topic: "node.js", relevance: 0, snippet: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine..." },
    { topic: "express", relevance: 0, snippet: "Express is a minimal and flexible Node.js web application framework..." },
    { topic: "mongodb", relevance: 0, snippet: "MongoDB is a source-available cross-platform document-oriented database..." },
    { topic: "sql", relevance: 0, snippet: "SQL (Structured Query Language) is a domain-specific language..." }
  ];
  
  // Calculate relevance (simple word matching - real search would be more sophisticated)
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  allDocs.forEach(doc => {
    doc.relevance = queryTerms.reduce((score, term) => {
      const termInTopic = doc.topic.toLowerCase().includes(term) ? 2 : 0;
      const termInSnippet = doc.snippet.toLowerCase().includes(term) ? 1 : 0;
      return score + termInTopic + termInSnippet;
    }, 0);
  });
  
  // Sort by relevance and limit results
  return allDocs
    .filter(doc => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}