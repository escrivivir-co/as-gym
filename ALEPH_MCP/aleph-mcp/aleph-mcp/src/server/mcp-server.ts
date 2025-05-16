import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { JSONRPCMessage, JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';

export class Server {
    private transport: StdioServerTransport;
    private tools: Map<string, { schema: z.ZodSchema<any>, handler: (args: any) => Promise<any> }>;

    constructor() {
        this.transport = new StdioServerTransport();
        this.tools = new Map();
        
        // Set up message handling
        this.transport.onmessage = async (message: JSONRPCMessage) => {
            await this.handleMessage(message);
        };
    }

    public async start() {
        console.log("MCP Server started and listening for connections.");
    }

    public tool(name: string, schema: z.ZodSchema<any>, handler: (args: any) => Promise<any>) {
        if (this.tools.has(name)) {
            console.warn(`Tool with name '${name}' already exists and will be overwritten.`);
        }
        
        this.tools.set(name, { schema, handler });
        return this;
    }

    private async handleMessage(message: JSONRPCMessage) {
        try {
            // Check if this is a method call (a request)
            if ('method' in message) {
                const request = message as JSONRPCRequest;
                
                if (request.method === 'ping') {
                    // Respond to ping messages with an object containing result
                    await this.sendResponse(request.id, { result: { response: 'pong' } });
                } else if (request.method === 'list_tools') {
                    // Respond with list of available tools
                    await this.sendToolsList(request.id);
                } else {
                    // Assume this is a tool call
                    await this.handleToolCall(request);
                }
            }
        } catch (error) {
            console.error('Error handling message:', error);
            
            // Send error response
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            const id = ('id' in message) ? message.id : '';  // Use empty string instead of null
            await this.sendError(id, -32603, errorMessage);
        }
    }

    private async handleToolCall(request: JSONRPCRequest) {
        const { id, method, params } = request;
        
        // Check if tool exists
        if (!this.tools.has(method)) {
            throw new Error(`Tool '${method}' not found`);
        }
        
        const { schema, handler } = this.tools.get(method)!;
        
        // Validate params against schema
        const validatedParams = schema.parse(params);
        
        // Execute tool handler
        const result = await handler(validatedParams);
        
        // Send response
        await this.sendResponse(id, { result });
    }

    private async sendToolsList(requestId: string | number) {
        const toolsList = Array.from(this.tools.entries()).map(([name, { schema }]) => {
            return {
                name,
                schema: schema.description || {}
            };
        });
        
        await this.sendResponse(requestId, { 
            result: { tools: toolsList } 
        });
    }

    private async sendResponse(id: string | number, response: { result: Record<string, unknown> }) {
        const fullResponse: JSONRPCResponse = {
            jsonrpc: '2.0',
            id,
            result: response.result
        };
        
        await this.transport.send(fullResponse);
    }

    private async sendError(id: string | number, code: number, message: string) {
        const errorResponse: JSONRPCError = {
            jsonrpc: '2.0',
            id,
            error: {
                code,
                message
            }
        };
        
        await this.transport.send(errorResponse);
    }
}