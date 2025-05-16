import { z } from "zod";

// Function to simulate fetching documentation based on a topic
export const getDocumentation = async (topic: string): Promise<string> => {
  const documentation: Record<string, string> = {
    "typescript": "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
    "mcp": "Model Context Protocol (MCP) is an open standard for connecting language models to external data sources.",
    // Add more topics as needed
  };

  return topic in documentation ? documentation[topic] : "Documentation not found for this topic.";
};

// Zod schema for validating the input for documentation retrieval
export const documentationSchema = z.object({
  topic: z.string().describe("The topic of the documentation to retrieve"),
});

// Tool definition for retrieving documentation
export const documentationTool = {
  name: "getDocumentation",
  schema: documentationSchema,
  handler: async ({ topic }: { topic: string }) => {
    const content = await getDocumentation(topic);
    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  },
};