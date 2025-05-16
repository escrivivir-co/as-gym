// Este archivo define los tipos para el SDK de MCP
declare module '@modelcontextprotocol/sdk' {
  export interface McpServerOptions {
    name: string;
    version: string;
    description?: string;
  }
  
  export class McpServer {
    constructor(options: McpServerOptions);
    tool(name: string, parameters: any, handler: (args: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
  }
  
  export class StdioServerTransport {
    constructor();
  }
  
  export namespace client {
    export class Client {
      constructor(options: { name: string; version: string });
      connect(transport: any): Promise<void>;
      disconnect(): Promise<void>;
      callTool(params: { name: string; arguments: any }): Promise<any>;
    }
  }
  
  export namespace client {
    export class StdioClientTransport {
      constructor(options: { command: string; args: string[] });
    }
  }
}