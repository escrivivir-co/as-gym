import { z } from "zod";

// Tool to retrieve documentation based on a topic
export const getDocumentation = async (topic: string): Promise<string> => {
    const documentationContent = await fetchDocumentationForTopic(topic);
    return documentationContent;
};

// Simulated function to fetch documentation
async function fetchDocumentationForTopic(topic: string): Promise<string> {
    const docs: Record<string, string> = {
        "typescript": "TypeScript is a typed superset of JavaScript...",
        "mcp": "Model Context Protocol is an open standard developed by Anthropic...",
        // More topics can be added here...
    };
    
    return topic in docs ? docs[topic] : "Documentation not found for this topic";
}