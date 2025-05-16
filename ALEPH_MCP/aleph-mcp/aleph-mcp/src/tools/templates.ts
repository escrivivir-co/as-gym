/**
 * Collection of prompt templates that can be used through the MCP server
 */
export const promptTemplates: Record<string, string> = {
  "code-review": "Review this code:\n\n```{{code}}```\n\nProvide feedback on:\n1. Readability\n2. Efficiency\n3. Best practices",
  
  "debug-help": "I need help debugging the following error in {{language}}:\n\n```{{error}}```\n\nRelated code:\n\n```{{code}}```",
  
  "documentation": "Create documentation for this {{language}} code:\n\n```{{code}}```\n\nInclude:\n1. Function descriptions\n2. Parameter details\n3. Return value information\n4. Usage examples",
  
  "refactor": "Refactor this {{language}} code to improve {{aspect}}:\n\n```{{code}}```",
  
  "unit-test": "Create unit tests for this {{language}} code:\n\n```{{code}}```\n\nUse the {{framework}} testing framework."
};