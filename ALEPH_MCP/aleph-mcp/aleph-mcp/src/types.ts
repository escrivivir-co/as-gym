// src/types/index.ts
export interface ToolArguments {
    [key: string]: any;
}

export interface ToolResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
}

export interface McpServerConfig {
    name: string;
    version: string;
}

export interface Tool {
    name: string;
    description: string;
    arguments: ToolArguments;
    execute: (args: ToolArguments) => Promise<ToolResponse>;
}