import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { promptTemplates } from "./templates";

/**
 * Register prompt-related tools to the MCP server
 */
export function registerPromptTools(server: McpServer) {
  // Tool to list all available templates
  server.tool(
    "listPromptTemplates",
    {},
    async () => {
      return {
        content: [
          { 
            type: "text", 
            text: JSON.stringify(Object.keys(promptTemplates))
          }
        ]
      };
    }
  );

  // Tool to retrieve a specific template
  server.tool(
    "getPromptTemplate",
    {
      name: z.string().describe("Name of the template to retrieve")
    },
    async ({ name }: { name: string }) => {
      const template = promptTemplates[name];
      
      return {
        content: [
          { 
            type: "text", 
            text: template || "Template not found"
          }
        ]
      };
    }
  );

  // Tool to apply variables to a template
  server.tool(
    "applyPromptTemplate",
    {
      templateName: z.string().describe("Name of the template to use"),
      variables: z.record(z.string()).describe("Variables to replace in the template")
    },
    async ({ templateName, variables }: { templateName: string, variables: Record<string, string> }) => {
      let template = promptTemplates[templateName];
      
      if (!template) {
        return {
          content: [{ type: "text", text: "Template not found" }]
        };
      }
      
      // Replace variables - corregido para usar función de reemplazo
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, () => value);
      });
      
      return {
        content: [{ type: "text", text: template }]
      };
    }
  );
}