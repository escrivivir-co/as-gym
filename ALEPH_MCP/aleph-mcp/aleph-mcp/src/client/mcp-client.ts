import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js";
import { ToolResponse } from "../types.js";
import { 
  CallToolRequest, 
  CallToolResultSchema, 
  ListToolsRequest, 
  ListToolsResultSchema 
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Wrapper class for MCP Client to simplify interactions with MCP servers
 */
export class AlephMcpClient {
  private client: Client;
  private transport: WebSocketClientTransport;
  private availableTools: string[] = [];

  /**
   * Create a new MCP client instance
   * @param serverUrl The WebSocket URL of the MCP server
   */
  constructor(serverUrl: string) {
    this.transport = new WebSocketClientTransport(
      new URL(serverUrl)
    );
    
    this.client = new Client({
      name: "aleph-mcp-client",
      version: "1.0.0"
    });
  }

  /**
   * Connect to the MCP server
   */
  public async connect(): Promise<void> {
    try {
      await this.client.connect(this.transport);
      console.log("Connected to MCP server");
      
      // Fetch available tools after connecting
      await this.refreshAvailableTools();
    } catch (error) {
      console.error("Error connecting to MCP server:", error);
      throw error;
    }
  }

  /**
   * Get a list of available tools from the server
   */
  public async refreshAvailableTools(): Promise<string[]> {
    try {
      const toolsRequest: ListToolsRequest = {
        method: 'tools/list',
        params: {}
      };
      
      const toolsResult = await this.client.request(toolsRequest, ListToolsResultSchema);
      this.availableTools = toolsResult.tools.map(tool => tool.name);
      return this.availableTools;
    } catch (error) {
      console.error("Error fetching available tools:", error);
      throw error;
    }
  }

  /**
   * Call a tool on the MCP server
   * @param toolName Name of the tool to call
   * @param params Parameters to pass to the tool
   */
  public async callTool<T = any>(toolName: string, params: Record<string, any> = {}): Promise<T> {
    try {
      if (!this.availableTools.includes(toolName)) {
        // Refresh tools list if the tool isn't in our cached list
        await this.refreshAvailableTools();
        
        if (!this.availableTools.includes(toolName)) {
          throw new Error(`Tool '${toolName}' not available on the server`);
        }
      }
      
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: params
        }
      };

      const response = await this.client.request(request, CallToolResultSchema);
      return response as unknown as T;
    } catch (error) {
      console.error(`Error calling tool '${toolName}':`, error);
      throw error;
    }
  }

  /**
   * Get a prompt template from the server
   * @param templateName Name of the template to retrieve
   */
  public async getPromptTemplate(templateName: string): Promise<string> {
    try {
      const response = await this.callTool<ToolResponse>("getPromptTemplate", { name: templateName });
      return response.content[0].text;
    } catch (error) {
      console.error(`Error getting prompt template '${templateName}':`, error);
      throw error;
    }
  }

  /**
   * Apply variables to a prompt template
   * @param templateName Name of the template to use
   * @param variables Variables to replace in the template
   */
  public async applyPromptTemplate(templateName: string, variables: Record<string, string>): Promise<string> {
    try {
      const response = await this.callTool<ToolResponse>("applyPromptTemplate", { 
        templateName, 
        variables 
      });
      return response.content[0].text;
    } catch (error) {
      console.error(`Error applying prompt template '${templateName}':`, error);
      throw error;
    }
  }

  /**
   * Analyze code using the server's code analysis tool
   * @param code Code to analyze
   * @param language Programming language of the code
   */
  public async analyzeCode(code: string, language: string): Promise<string> {
    try {
      const response = await this.callTool<ToolResponse>("analyzeCode", { code, language });
      return response.content[0].text;
    } catch (error) {
      console.error("Error analyzing code:", error);
      throw error;
    }
  }

  /**
   * Search documentation using the server's documentation tool
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  public async searchDocumentation(query: string, limit: number = 5): Promise<Array<{topic: string, relevance: number, snippet: string}>> {
    try {
      const response = await this.callTool<ToolResponse>("searchDocumentation", { query, limit });
      return JSON.parse(response.content[0].text);
    } catch (error) {
      console.error("Error searching documentation:", error);
      throw error;
    }
  }

  /**
   * Close the connection to the MCP server
   */
  public async disconnect(): Promise<void> {
    await this.transport.close();
    console.log("Disconnected from MCP server");
  }
}