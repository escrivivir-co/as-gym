// src/tools/documentation-tools.ts
import { z } from "zod";

// Function to simulate fetching documentation based on a topic
export const getDocumentation = async (topic: string): Promise<string> => {
    const documentation: Record<string, string> = {
        "typescript": "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        "mcp": "Model Context Protocol (MCP) is a standard for connecting language models with external data sources.",
        // Add more topics as needed
    };

    return topic in documentation ? documentation[topic] : "Documentation not found for this topic.";
};

// Schema for validating documentation requests
export const documentationSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
});

// Function to retrieve documentation content
export const fetchDocumentation = async (topic: string) => {
    const validatedTopic = documentationSchema.parse({ topic });
    return await getDocumentation(validatedTopic.topic);
};